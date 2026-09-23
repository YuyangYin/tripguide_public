import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeConfig } from '../types';
import { CopyButton } from './CopyButton';
import { useSharedTable } from '../lib/useSharedTable';
import { 
  FolderOpen, 
  UploadCloud, 
  Trash2, 
  Eye, 
  X, 
  FileText, 
  CheckCircle2, 
  Tag, 
  Calendar, 
  Clock,
  AlertCircle, 
  Home, 
  MapPin, 
  Plus, 
  Info,
  ChevronRight,
  ArrowRight,
  Plane,
  Loader2,
  Copy,
  ExternalLink,
  Phone,
  Luggage
} from 'lucide-react';
import { getCardStyle, getDropzoneStyle, getInputStyle, getTabBarStyle, getTabItemStyle, getPrimaryButtonStyle, getSecondaryButtonStyle } from '../lib/themeStyles';
import { extractDocumentText } from '../lib/extractDocumentText';
import { hasAnyFlightField, isCompleteFlightParse, parseFlightText, sortFlightsByDeparture } from '../lib/parseFlightText';
import { expandHotelNights, hasAnyHotelField, isCompleteHotelParse, parseHotelText } from '../lib/parseHotelText';
import { deleteVoucherFile, getVoucherUrl, uploadVoucherFile } from '../lib/voucherStorage';
import BaggageAllowancePanel from './BaggageAllowancePanel';
import { getBaggageRuleLines, getFlightAirlineRule } from '../lib/baggageAllowance';

const getCityFromAddress = (address: string, hotelName: string) => {
  const cities = ['雷克雅未克', '罗弗敦', '维克', '赫拉', '奥斯陆', '特罗姆瑟', 'Hella', 'Vík', 'Reykjavík', 'Lofoten', 'Oslo', 'Tromsø', 'Svolvær', 'Henningsvær', 'Keflavík'];
  for (const city of cities) {
    if (address.includes(city) || hotelName.includes(city)) {
      if (city === 'Hella') return '赫拉 (Hella)';
      if (city === 'Vík') return '维克 (Vík)';
      if (city === 'Reykjavík' || city === '雷克雅未克') return '雷克雅未克 (Reykjavík)';
      if (city === 'Lofoten' || city === '罗弗敦') return '罗弗敦 (Lofoten)';
      if (city === 'Oslo' || city === '奥斯陆') return '奥斯陆 (Oslo)';
      if (city === 'Tromsø' || city === '特罗姆瑟') return '特罗姆瑟 (Tromsø)';
      if (city === 'Svolvær') return '斯沃尔韦尔 (Svolvær)';
      if (city === 'Henningsvær') return '亨宁斯韦尔 (Henningsvær)';
      if (city === 'Keflavík') return '凯夫拉维克 (Keflavík)';
      return city;
    }
  }
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 2) {
    const possibleCity = parts[parts.length - 2];
    if (possibleCity && !/^\d+$/.test(possibleCity)) {
      return possibleCity;
    }
  }
  return parts[0] || '北欧城市';
};

interface VoucherItem {
  id: string;
  title: string;
  category: 'ticket' | 'stay' | 'rent' | 'flight' | 'doc';
  fileName: string;
  fileType: string;
  fileSize: string;
  fileData?: string; // Base64 data url
  filePath?: string;
  uploadDate: string;
  useDate?: string;
  useTime?: string;
  status: 'Ready' | 'Verified' | 'Pending';
}

interface HotelStay {
  id: string;
  date: string; // YYYY-MM-DD
  hotelName: string;
  roomType: string;
  address: string;
  phone?: string;
  confirmationNo?: string;
}

interface FlightTicket {
  id: string;
  flightNo: string;
  airline: string;
  depAirport: string;
  arrAirport: string;
  depDate: string;
  depTime: string;
  arrTime: string;
  seatNo: string;
  gate?: string;
  classType: string;
  status: 'Scheduled' | 'On Time' | 'Boarding' | 'Departed';
}

interface VoucherFolderProps {
  theme: ThemeConfig;
  onPreviewVoucher: (item: any | null, list?: any[]) => void;
}

interface NativePickerFieldProps {
  type: 'date' | 'time';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  inputClassName: string;
}

const formatPickerValue = (type: 'date' | 'time', value: string) => {
  if (!value) return '';
  if (type === 'time') return value.slice(0, 5);

  const [year, month, day] = value.split('-');
  return year && month && day ? `${year} / ${month} / ${day}` : value;
};

function NativePickerField({ type, value, onChange, placeholder, ariaLabel, inputClassName }: NativePickerFieldProps) {
  const Icon = type === 'date' ? Calendar : Clock;
  const displayValue = formatPickerValue(type, value);

  return (
    <div className={`relative w-full min-w-0 max-w-full overflow-hidden focus-within:ring-1 focus-within:ring-current/30 ${inputClassName}`}>
      <div aria-hidden="true" className="pointer-events-none flex min-h-8 min-w-0 items-center justify-between gap-2 px-3 py-2 text-xs font-medium">
        <span className={`min-w-0 truncate ${displayValue ? '' : 'opacity-60'}`}>
          {displayValue || placeholder}
        </span>
        <Icon className="h-4 w-4 shrink-0 opacity-80" />
      </div>
      <input
        type={type}
        aria-label={ariaLabel}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onInput={(event) => onChange(event.currentTarget.value)}
        className="native-picker-input absolute inset-0 z-10 block h-full w-full min-w-0 max-w-full cursor-pointer opacity-0"
      />
    </div>
  );
}

const DEFAULT_VOUCHERS: VoucherItem[] = [];

const DEFAULT_HOTELS: HotelStay[] = [
  { id: 'hotel-barcelona-0925', date: '2026-09-25', hotelName: 'Barcelona Apartment', roomType: '小红书民宿（3 晚）', address: 'Carrer Josep Pla 27, 08019 Barcelona' },
  { id: 'hotel-wynigen-0927', date: '2026-09-27', hotelName: 'Wynigen Airbnb', roomType: '民宿（1 晚）', address: 'Wynigen, Switzerland' },
  { id: 'hotel-amsterdam-0928', date: '2026-09-28', hotelName: 'Hotel2Stay', roomType: '2 间（1 晚）', address: 'Amsterdam, Netherlands' },
  { id: 'hotel-hornindal-0929', date: '2026-09-29', hotelName: 'Hornindal Airbnb', roomType: '民宿（2 晚）', address: 'Harevadet 8, Volda, Møre og Romsdal 6763' },
  { id: 'hotel-bergen-1001', date: '2026-10-01', hotelName: 'Moxy Hotel Bergen', roomType: '酒店（1 晚）', address: 'Bergen, Norway' },
  { id: 'hotel-lofoten-1002', date: '2026-10-02', hotelName: 'Lyngvær Lodge, Kleppstad', roomType: '罗弗敦民宿（2 晚）', address: 'Veg 2804, 6, Lyngværet, 8313' },
  { id: 'hotel-oslo-1004', date: '2026-10-04', hotelName: 'Radisson Blu Plaza Hotel, Oslo', roomType: '2 间（1 晚，不含早）', address: 'Oslo, Norway' },
  { id: 'hotel-stockholm-1005', date: '2026-10-05', hotelName: 'AC Hotel Stockholm Ulriksdal', roomType: '2 间（1 晚，含早餐）', address: 'Stockholm, Sweden' },
];

const DEFAULT_FLIGHTS: FlightTicket[] = [
  { id: 'flight-ca105', flightNo: 'CA105', airline: 'Air China', depAirport: 'HKG 香港', arrAirport: 'PEK 北京', depDate: '2026-09-24', depTime: '17:45', arrTime: '21:15', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-ca933', flightNo: 'CA933', airline: 'Air China', depAirport: 'PEK 北京', arrAirport: 'BCN 巴塞罗那', depDate: '2026-09-25', depTime: '02:50', arrTime: '08:15', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-vy6200', flightNo: 'VY6200', airline: 'Vueling', depAirport: 'BCN 巴塞罗那', arrAirport: 'GVA 日内瓦', depDate: '2026-09-27', depTime: '07:25', arrTime: '09:05', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-kl1948', flightNo: 'KL1948', airline: 'KLM', depAirport: 'BSL 巴塞尔', arrAirport: 'AMS 阿姆斯特丹', depDate: '2026-09-28', depTime: '18:30', arrTime: '19:55', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-kl1163', flightNo: 'KL1163', airline: 'KLM', depAirport: 'AMS 阿姆斯特丹', arrAirport: 'BGO 卑尔根', depDate: '2026-09-29', depTime: '08:20', arrTime: '10:00', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-sk326', flightNo: 'SK326', airline: 'SAS', depAirport: 'BGO 卑尔根', arrAirport: 'OSL 奥斯陆', depDate: '2026-10-02', depTime: '06:30', arrTime: '07:25', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-sk4082', flightNo: 'SK4082', airline: 'SAS', depAirport: 'OSL 奥斯陆', arrAirport: 'EVE 埃文内斯', depDate: '2026-10-02', depTime: '08:40', arrTime: '10:20', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-dy369', flightNo: 'DY369', airline: 'Norwegian', depAirport: 'EVE 埃文内斯', arrAirport: 'OSL 奥斯陆', depDate: '2026-10-04', depTime: '20:05', arrTime: '21:50', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-dy812', flightNo: 'DY812', airline: 'Norwegian', depAirport: 'OSL 奥斯陆', arrAirport: 'ARN 斯德哥尔摩', depDate: '2026-10-05', depTime: '11:40', arrTime: '12:40', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-ca932', flightNo: 'CA932', airline: 'Air China', depAirport: 'ARN 斯德哥尔摩', arrAirport: 'PEK 北京', depDate: '2026-10-06', depTime: '19:10', arrTime: '09:40', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
  { id: 'flight-ca101', flightNo: 'CA101', airline: 'Air China', depAirport: 'PEK 北京', arrAirport: 'HKG 香港', depDate: '2026-10-07', depTime: '12:25', arrTime: '16:40', seatNo: '待分配', classType: '经济舱', status: 'Scheduled' },
];

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function VoucherFolder({ theme, onPreviewVoucher }: VoucherFolderProps) {
  const [activeSubTab, setActiveSubTab] = useState<'hotel' | 'flight' | 'ticket'>('hotel');
  
  // Flight Tickets States
  const [flights, setFlights, , flightsError] = useSharedTable<FlightTicket>('flights', 'polar_flights_v2', DEFAULT_FLIGHTS);
  const [newFlightNo, setNewFlightNo] = useState('');
  const [newAirline, setNewAirline] = useState('');
  const [newDepAirport, setNewDepAirport] = useState('');
  const [newArrAirport, setNewArrAirport] = useState('');
  const [newDepDate, setNewDepDate] = useState('');
  const [newDepTime, setNewDepTime] = useState('');
  const [newArrTime, setNewArrTime] = useState('');
  const [newSeatNo, setNewSeatNo] = useState('');
  const [newGate, setNewGate] = useState('');
  const [newClassType, setNewClassType] = useState('经济舱');
  const [showAddFlightForm, setShowAddFlightForm] = useState(false);

  const [isScanningFlight, setIsScanningFlight] = useState(false);
  const [scanStatusText, setScanStatusText] = useState('');
  const [flightDragActive, setFlightDragActive] = useState(false);
  const flightFileInputRef = useRef<HTMLInputElement>(null);
  const [scannedResult, setScannedResult] = useState<FlightTicket | null>(null);
  const [parseHint, setParseHint] = useState<'empty' | 'partial' | null>(null);
  const ignoreFlightDeleteUntil = useRef(0);

  // Voucher Clip States
  const [vouchers, setVouchers, vouchersLoaded, vouchersSyncError] = useSharedTable<VoucherItem>('vouchers', 'polar_vouchers', DEFAULT_VOUCHERS);
  const [title, setTitle] = useState('');
  const [useDate, setUseDate] = useState('');
  const [useTime, setUseTime] = useState('');
  const [category, setCategory] = useState<'ticket' | 'stay' | 'rent' | 'flight' | 'doc'>('ticket');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileDataUrl, setSelectedFileDataUrl] = useState<string>('');
  const [showAddVoucherForm, setShowAddVoucherForm] = useState(false);
  const [isUploadingVoucher, setIsUploadingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hotel Stays States
  const [hotelStays, setHotelStays, , hotelsError] = useSharedTable<HotelStay>('hotels', 'polar_hotels_v2', DEFAULT_HOTELS);
  const [newHotelDate, setNewHotelDate] = useState('');
  const [newHotelName, setNewHotelName] = useState('');
  const [newHotelRoom, setNewHotelRoom] = useState('');
  const [newHotelAddress, setNewHotelAddress] = useState('');
  const [newHotelPhone, setNewHotelPhone] = useState('');
  const [newHotelConfirmNo, setNewHotelConfirmNo] = useState('');
  const [showAddHotelForm, setShowAddHotelForm] = useState(false);
  const [isScanningHotel, setIsScanningHotel] = useState(false);
  const [hotelParseHint, setHotelParseHint] = useState<'empty' | 'partial' | null>(null);
  const [hotelDragActive, setHotelDragActive] = useState(false);
  const [hotelScanStatusText, setHotelScanStatusText] = useState('');
  const hotelFileInputRef = useRef<HTMLInputElement>(null);

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const isCyber = theme.id === 'cyber';
  const isNewspaper = theme.id === 'newspaper';
  const isFrosted = theme.id === 'frosted';
  const isMidnight = theme.id === 'midnight';

  useEffect(() => {
    if (!vouchersLoaded) return;
    const legacy = vouchers.filter((voucher) => voucher.fileData?.startsWith('data:') && !voucher.filePath);
    if (legacy.length === 0) return;
    void Promise.all(legacy.map(async (voucher) => {
      const response = await fetch(voucher.fileData!);
      const blob = await response.blob();
      const file = new File([blob], voucher.fileName, { type: voucher.fileType || blob.type });
      const filePath = await uploadVoucherFile(file);
      return { ...voucher, filePath, fileData: undefined };
    })).then((migrated) => {
      const byId = new Map(migrated.map((voucher) => [voucher.id, voucher]));
      setVouchers((current) => current.map((voucher) => byId.get(voucher.id) || voucher));
    }).catch((error) => setVoucherError(error instanceof Error ? error.message : '旧票据迁移失败'));
  }, [vouchers, vouchersLoaded, setVouchers]);

  // Three datasets are cached locally and synchronized through Supabase.

  // 保留 saveXxx 别名，避免下面 10+ 处调用点全部改动。
  // useSharedTable persists both the local cache and cloud rows.
  // 这里直接转发即可。
  const saveVouchers = setVouchers;
  const saveHotels   = setHotelStays;
  const saveFlights  = setFlights;

  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlightNo.trim() || !newAirline.trim() || !newDepAirport.trim() || !newArrAirport.trim() || !newDepDate) return;

    const newFlight: FlightTicket = {
      id: Date.now().toString(),
      flightNo: newFlightNo.trim().toUpperCase(),
      airline: newAirline.trim(),
      depAirport: newDepAirport.trim(),
      arrAirport: newArrAirport.trim(),
      depDate: newDepDate,
      depTime: newDepTime,
      arrTime: newArrTime,
      seatNo: newSeatNo.trim() || '随机分配 (TBD)',
      gate: newGate.trim() || undefined,
      classType: newClassType,
      status: 'Scheduled'
    };

    finishFlightSave(newFlight);
  };

  const orderedFlights = useMemo(
    () => sortFlightsByDeparture(Array.isArray(flights) ? flights : []),
    [flights]
  );

  const flightDateGroups = useMemo(() => {
    const groups: { dateKey: string; flights: FlightTicket[] }[] = [];
    for (const flight of orderedFlights) {
      const dateKey = (flight.depDate || '').trim() || '__pending';
      const last = groups[groups.length - 1];
      if (last?.dateKey === dateKey) last.flights.push(flight);
      else groups.push({ dateKey, flights: [flight] });
    }
    return groups;
  }, [orderedFlights]);

  const closeFlightComposer = () => {
    setShowAddFlightForm(false);
    setScannedResult(null);
    setParseHint(null);
    setIsScanningFlight(false);
    resetFlightForm();
  };

  const openFlightComposer = () => {
    setScannedResult(null);
    setParseHint(null);
    resetFlightForm();
    setShowAddFlightForm(true);
  };

  const finishFlightSave = (flight: FlightTicket) => {
    saveFlights(prev => sortFlightsByDeparture(prev.some(item => item.id === flight.id) ? prev : [...prev, flight]));
    ignoreFlightDeleteUntil.current = Date.now() + 800;
    closeFlightComposer();
  };

  const resetFlightForm = () => {
    setNewFlightNo('');
    setNewAirline('');
    setNewDepAirport('');
    setNewArrAirport('');
    setNewDepDate('');
    setNewDepTime('');
    setNewArrTime('');
    setNewSeatNo('');
    setNewGate('');
    setNewClassType('经济舱');
  };

  const handleDeleteFlight = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (Date.now() < ignoreFlightDeleteUntil.current) return;
    setConfirmModal({
      isOpen: true,
      title: '确认删除机票',
      message: '你确认要删除此机票预订记录吗？删除后将无法恢复。',
      onConfirm: () => {
        const updated = flights.filter(flight => flight.id !== id);
        saveFlights(updated);
      }
    });
  };

  const handleFlightDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setFlightDragActive(true);
    } else if (e.type === "dragleave") {
      setFlightDragActive(false);
    }
  };

  const handleFlightDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlightDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFlightAutoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFlightFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFlightAutoUpload(e.target.files[0]);
    }
  };

  const applyParsedFlight = (parsed: ReturnType<typeof parseFlightText>) => {
    if (parsed.flightNo) setNewFlightNo(parsed.flightNo);
    if (parsed.airline) setNewAirline(parsed.airline);
    if (parsed.depAirport) setNewDepAirport(parsed.depAirport);
    if (parsed.arrAirport) setNewArrAirport(parsed.arrAirport);
    if (parsed.depDate) setNewDepDate(parsed.depDate);
    if (parsed.depTime) setNewDepTime(parsed.depTime);
    if (parsed.arrTime) setNewArrTime(parsed.arrTime);
    if (parsed.seatNo) setNewSeatNo(parsed.seatNo);
    if (parsed.gate) setNewGate(parsed.gate);
    if (parsed.classType) setNewClassType(parsed.classType);
  };

  const handleFlightAutoUpload = async (file: File) => {
    if (!file) return;

    setIsScanningFlight(true);
    setScannedResult(null);
    setParseHint(null);
    setScanStatusText('正在读取文件…');

    try {
      const extracted = await extractDocumentText(file, setScanStatusText);
      const fileHint = file.name.replace(/[_-]+/g, ' ').replace(/\.[a-z0-9]+$/i, '');
      const parsed = parseFlightText([extracted, fileHint].filter(Boolean).join('\n'));

      if (isCompleteFlightParse(parsed) && parsed.flightNo && parsed.depAirport && parsed.arrAirport) {
        const newScannedFlight: FlightTicket = {
          id: Date.now().toString(),
          flightNo: parsed.flightNo.toUpperCase(),
          airline: parsed.airline || parsed.flightNo.slice(0, 2),
          depAirport: parsed.depAirport,
          arrAirport: parsed.arrAirport,
          depDate: parsed.depDate || '',
          depTime: parsed.depTime || '',
          arrTime: parsed.arrTime || '',
          seatNo: parsed.seatNo || '随机分配 (TBD)',
          gate: parsed.gate,
          classType: parsed.classType || '经济舱',
          status: 'Scheduled'
        };
        finishFlightSave(newScannedFlight);
        return;
      }

      applyParsedFlight(parsed);
      setParseHint(hasAnyFlightField(parsed) ? 'partial' : 'empty');
    } catch (e) {
      console.warn('[flight-parse] failed', e);
      setParseHint('empty');
    } finally {
      setIsScanningFlight(false);
      setScanStatusText('');
      if (flightFileInputRef.current) flightFileInputRef.current.value = '';
    }
  };

  // Drag and Drop handlers for Voucher Clip
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedFileDataUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedFile) return;

    setIsUploadingVoucher(true);
    setVoucherError('');
    let filePath: string;
    try {
      filePath = await uploadVoucherFile(selectedFile);
    } catch (error) {
      setVoucherError(error instanceof Error ? error.message : '文件上传失败，请稍后重试');
      setIsUploadingVoucher(false);
      return;
    }

    const newItem: VoucherItem = {
      id: Date.now().toString(),
      title: title.trim(),
      category,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSize: formatBytes(selectedFile.size),
      filePath,
      uploadDate: getLocalDate(),
      useDate: useDate || undefined,
      useTime: useTime || undefined,
      status: 'Ready'
    };

    const updated = [newItem, ...vouchers];
    saveVouchers(updated);
    
    // Reset inputs
    setTitle('');
    setUseDate('');
    setUseTime('');
    setCategory('ticket');
    setSelectedFile(null);
    setSelectedFileDataUrl('');
    setIsUploadingVoucher(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteVoucher = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: '确认删除票根',
      message: '你确认要删除该票根文件吗？该操作会从共享云端永久移除。',
      onConfirm: () => {
        const item = vouchers.find((voucher) => voucher.id === id);
        if (item?.filePath) void deleteVoucherFile(item.filePath).catch(() => undefined);
        const updated = vouchers.filter(item => item.id !== id);
        saveVouchers(updated);
        onPreviewVoucher(null);
      }
    });
  };

  const resetHotelForm = () => {
    setNewHotelDate('');
    setNewHotelName('');
    setNewHotelRoom('');
    setNewHotelAddress('');
    setNewHotelPhone('');
    setNewHotelConfirmNo('');
  };

  const closeHotelComposer = () => {
    setShowAddHotelForm(false);
    setHotelParseHint(null);
    setIsScanningHotel(false);
    setHotelScanStatusText('');
    resetHotelForm();
  };

  const openHotelComposer = () => {
    setHotelParseHint(null);
    resetHotelForm();
    setShowAddHotelForm(true);
  };

  const upsertHotelStays = (incoming: HotelStay[]) => {
    saveHotels((prev) => {
      let next = [...prev];
      incoming.forEach((stay, index) => {
        const duplicate = next.find((item) => item.date === stay.date);
        if (duplicate) {
          next = next.map((item) => (item.date === stay.date ? { ...stay, id: duplicate.id } : item));
        } else {
          next.push({ ...stay, id: stay.id || `${Date.now()}-${index}` });
        }
      });
      return next.sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const finishHotelSave = (incoming: HotelStay[]) => {
    upsertHotelStays(incoming);
    closeHotelComposer();
  };

  const handleAddHotel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHotelName.trim() || !newHotelDate) return;

    const duplicate = hotelStays.find(stay => stay.date === newHotelDate);
    if (duplicate) {
      if (!window.confirm(`日期 ${newHotelDate} 已有酒店「${duplicate.hotelName}」的入住记录。是否覆盖该日的酒店信息？`)) {
        return;
      }
    }

    finishHotelSave([{
      id: duplicate ? duplicate.id : Date.now().toString(),
      date: newHotelDate,
      hotelName: newHotelName.trim(),
      roomType: newHotelRoom.trim() || '标准双人间 (Standard Double)',
      address: newHotelAddress.trim() || 'Iceland Road Location',
      phone: newHotelPhone.trim() || undefined,
      confirmationNo: newHotelConfirmNo.trim() || undefined
    }]);
  };

  const applyParsedHotel = (parsed: ReturnType<typeof parseHotelText>) => {
    if (parsed.hotelName) setNewHotelName(parsed.hotelName);
    if (parsed.checkIn) setNewHotelDate(parsed.checkIn);
    if (parsed.roomType) setNewHotelRoom(parsed.roomType);
    if (parsed.address) setNewHotelAddress(parsed.address);
    if (parsed.phone) setNewHotelPhone(parsed.phone);
    if (parsed.confirmationNo) setNewHotelConfirmNo(parsed.confirmationNo);
  };

  const handleHotelDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setHotelDragActive(true);
    else if (e.type === 'dragleave') setHotelDragActive(false);
  };

  const handleHotelAutoUpload = async (file: File) => {
    if (!file) return;

    setIsScanningHotel(true);
    setHotelParseHint(null);
    setHotelScanStatusText('正在读取文件…');

    try {
      const extracted = await extractDocumentText(file, setHotelScanStatusText);
      const fileHint = file.name.replace(/[_-]+/g, ' ').replace(/\.[a-z0-9]+$/i, '');
      const parsed = parseHotelText([extracted, fileHint].filter(Boolean).join('\n'));

      if (isCompleteHotelParse(parsed) && parsed.hotelName && parsed.checkIn) {
        const nights = parsed.nights?.length ? parsed.nights : expandHotelNights(parsed.checkIn, parsed.checkOut);
        finishHotelSave(nights.map((date, index) => ({
          id: `${Date.now()}-${index}`,
          date,
          hotelName: parsed.hotelName!,
          roomType: parsed.roomType || '标准双人间 (Standard Double)',
          address: parsed.address || '',
          phone: parsed.phone,
          confirmationNo: parsed.confirmationNo
        })));
        return;
      }

      applyParsedHotel(parsed);
      setHotelParseHint(hasAnyHotelField(parsed) ? 'partial' : 'empty');
    } catch (e) {
      console.warn('[hotel-parse] failed', e);
      setHotelParseHint('empty');
    } finally {
      setIsScanningHotel(false);
      setHotelScanStatusText('');
      if (hotelFileInputRef.current) hotelFileInputRef.current.value = '';
    }
  };

  const handleHotelDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHotelDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleHotelAutoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleHotelFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleHotelAutoUpload(e.target.files[0]);
    }
  };

  const handleDeleteHotelStay = (ids: string[], e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: '确认删除酒店入住',
      message: '你确认要删除此酒店入住记录吗？删除后将无法恢复。',
      onConfirm: () => {
        const idsToDelete = new Set(ids);
        saveHotels(hotelStays.filter(stay => !idsToDelete.has(stay.id)));
      }
    });
  };

  // Consecutive Stays Merging Algorithm
  // If staying at the same hotel for multiple consecutive days, they are merged.
  const mergedHotels = useMemo(() => {
    if (hotelStays.length === 0) return [];

    // Sort stays strictly by calendar date ascending
    const sortedStays = [...hotelStays].sort((a, b) => a.date.localeCompare(b.date));

    const mergedList: Array<{
      hotelName: string;
      roomType: string;
      address: string;
      phone?: string;
      confirmationNo?: string;
      dates: string[]; // List of consecutive stays dates
      ids: string[];   // Original database/state stay IDs
    }> = [];

    for (const stay of sortedStays) {
      if (mergedList.length === 0) {
        mergedList.push({
          hotelName: stay.hotelName,
          roomType: stay.roomType,
          address: stay.address,
          phone: stay.phone,
          confirmationNo: stay.confirmationNo,
          dates: [stay.date],
          ids: [stay.id]
        });
      } else {
        const lastMerged = mergedList[mergedList.length - 1];
        
        // Parse date values to verify if they are strictly consecutive calendar days
        const lastDateString = lastMerged.dates[lastMerged.dates.length - 1];
        const lastDateObj = new Date(lastDateString);
        const currentDateObj = new Date(stay.date);
        
        const diffTime = Math.abs(currentDateObj.getTime() - lastDateObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Matching name comparison (case-insensitive and trimmed whitespace)
        const isSameHotel = lastMerged.hotelName.trim().toLowerCase() === stay.hotelName.trim().toLowerCase();

        if (isSameHotel && diffDays === 1) {
          // If same hotel and consecutive day, merge together
          lastMerged.dates.push(stay.date);
          lastMerged.ids.push(stay.id);
          // Auto-fill phone/confirm no if missing on the earlier entry
          if (!lastMerged.phone && stay.phone) lastMerged.phone = stay.phone;
          if (!lastMerged.confirmationNo && stay.confirmationNo) lastMerged.confirmationNo = stay.confirmationNo;
        } else {
          // New hotel or non-consecutive day gap
          mergedList.push({
            hotelName: stay.hotelName,
            roomType: stay.roomType,
            address: stay.address,
            phone: stay.phone,
            confirmationNo: stay.confirmationNo,
            dates: [stay.date],
            ids: [stay.id]
          });
        }
      }
    }
    return mergedList;
  }, [hotelStays]);

  // Date formatter (e.g. "2026-09-12" to "9月12日")
  const formatDateLabel = (dateStr?: string) => {
    const parts = (dateStr || '').split('-');
    if (parts.length === 3) {
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      return `${month}月${day}日`;
    }
    return dateStr || '—';
  };

  const formatVoucherWhen = (dateStr?: string, timeStr?: string) => {
    const dateLabel = formatDateLabel(dateStr);
    const prettyDate = dateLabel === '—' ? '' : dateLabel;
    const prettyTime = (timeStr || '').slice(0, 5);
    return [prettyDate, prettyTime].filter(Boolean).join(' ');
  };

  const renderLocalDate = (dateStr?: string) => {
    const parts = (dateStr || '').split('-');
    const month = parseInt(parts[1] || '', 10);
    const day = parseInt(parts[2] || '', 10);
    if (!month || !day) return '日期待补';
    return <>当地<span className="font-bold">{month}</span>月<span className="font-bold">{day}</span>日</>;
  };

  const splitAirport = (raw?: string) => {
    const parts = (raw || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { city: '', code: '—' };
    if (parts.length === 1) return { city: '', code: parts[0] };
    return { city: parts.slice(0, -1).join(' '), code: parts[parts.length - 1] };
  };

  return (
    <div className={`p-4 space-y-5 transition-all duration-300 relative ${getCardStyle(theme.id, 'primary')}`}>
      {(flightsError || hotelsError || vouchersSyncError) && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-500">
          云端同步异常：{flightsError || hotelsError || vouchersSyncError}
        </p>
      )}

      {/* Three Tab Toggle switch headers inside the Voucher folder */}
      <div className={`flex gap-1 select-none w-full ${getTabBarStyle(theme.id)}`}>
        <button
          onClick={() => setActiveSubTab('hotel')}
          className={`flex-1 py-2 text-center text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 ${getTabItemStyle(theme.id, activeSubTab === 'hotel')}`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>酒店住宿</span>
        </button>

        <button
          onClick={() => setActiveSubTab('flight')}
          className={`flex-1 py-2 text-center text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 ${getTabItemStyle(theme.id, activeSubTab === 'flight')}`}
        >
          <Plane className="w-3.5 h-3.5" />
          <span>机票航线</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ticket')}
          className={`flex-1 py-2 text-center text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 ${getTabItemStyle(theme.id, activeSubTab === 'ticket')}`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>景点门票</span>
        </button>
      </div>

      {/* RENDER TAB 1: 酒店信息 (Hotel stays grouped & merged consecutive stays) */}
      {activeSubTab === 'hotel' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Home className={`w-4 h-4 ${isCyber ? 'text-[#00F5FF]' : 'text-purple-400'}`} />
              <h4 className={`text-xs font-black ${isNewspaper ? 'font-serif text-[#1B1917]' : ''}`}>
                每日酒店入住
              </h4>
            </div>

            <button
              onClick={() => showAddHotelForm ? closeHotelComposer() : openHotelComposer()}
              className={`py-1 px-2.5 text-[10px] flex items-center gap-1 cursor-pointer ${getSecondaryButtonStyle(theme.id)}`}
            >
              <Plus className="w-3 h-3" />
              <span>{showAddHotelForm ? '收起' : '添加'}</span>
            </button>
          </div>

          {showAddHotelForm && (
            <div className="space-y-3 animate-fadeIn">
              <input
                ref={hotelFileInputRef}
                type="file"
                accept="image/*,application/pdf,.txt"
                onChange={handleHotelFileInputChange}
                className="hidden"
              />

              <div className={`p-4 space-y-3 ${getCardStyle(theme.id, 'subcard')}`}>
                <p className="text-[10px] font-black">方式一 · 上传识别</p>

                {isScanningHotel ? (
                  <div className="py-6 space-y-3 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-7 h-7 text-sky-400 animate-spin" />
                    <p className="text-xs font-black">正在识别酒店信息</p>
                    <p className="text-[9px] opacity-50">{hotelScanStatusText || '识别成功后会直接加入列表'}</p>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleHotelDrag}
                    onDragOver={handleHotelDrag}
                    onDragLeave={handleHotelDrag}
                    onDrop={handleHotelDrop}
                    onClick={() => hotelFileInputRef.current?.click()}
                    className={`border-2 border-dashed p-5 text-center cursor-pointer transition-all ${getDropzoneStyle(theme.id, hotelDragActive)}`}
                  >
                    <UploadCloud className="w-7 h-7 text-stone-400 opacity-80 mx-auto" />
                    <p className="text-xs font-normal mt-2 text-stone-800 dark:text-stone-100">
                      点击上传酒店订单、确认函图片或PDF，可自动解析入住信息
                    </p>
                  </div>
                )}

                {hotelParseHint === 'empty' && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">
                      这份文件没有解析到酒店信息。请改用下方「手动填写」，不用再传一次。
                    </p>
                  </div>
                )}
                {hotelParseHint === 'partial' && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                    <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-sky-700 dark:text-sky-300">
                      只识别到一部分，已填进下方表单，补全后点保存即可。
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 px-1 opacity-40">
                <div className="flex-1 h-px bg-current" />
                <span className="text-[9px] font-black">或</span>
                <div className="flex-1 h-px bg-current" />
              </div>

              <div className={`p-4 space-y-3 min-w-0 overflow-hidden ${getCardStyle(theme.id, 'subcard')}`}>
                <form onSubmit={handleAddHotel} className="space-y-3 text-left min-w-0">
                  <p className="text-[10px] font-black">方式二 · 手动填写</p>
                  <div className="grid grid-cols-1 gap-2 min-w-0">
                    <div className="space-y-1 min-w-0">
                      <label className="text-[9px] font-black opacity-75">入住日期</label>
                      <input
                        type="date"
                        required
                        value={newHotelDate}
                        onChange={(e) => setNewHotelDate(e.target.value)}
                        className={`w-full min-w-0 max-w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <label className="text-[9px] font-black opacity-75">确认单号</label>
                      <input
                        type="text"
                        placeholder="可选"
                        value={newHotelConfirmNo}
                        onChange={(e) => setNewHotelConfirmNo(e.target.value)}
                        className={`w-full min-w-0 max-w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black opacity-75">酒店名称</label>
                    <input
                      type="text"
                      required
                      placeholder="如 Hotel Lotus"
                      value={newHotelName}
                      onChange={(e) => setNewHotelName(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black opacity-75">房型</label>
                    <input
                      type="text"
                      placeholder="可选"
                      value={newHotelRoom}
                      onChange={(e) => setNewHotelRoom(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black opacity-75">地址</label>
                    <input
                      type="text"
                      placeholder="可选"
                      value={newHotelAddress}
                      onChange={(e) => setNewHotelAddress(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black opacity-75">电话</label>
                    <input
                      type="text"
                      placeholder="可选"
                      value={newHotelPhone}
                      onChange={(e) => setNewHotelPhone(e.target.value)}
                      className={`w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2 text-xs cursor-pointer shadow-sm ${getPrimaryButtonStyle(theme.id)}`}
                  >
                    保存酒店
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-5">
          {mergedHotels.length === 0 && !showAddHotelForm ? (
            <p className="text-center text-xs opacity-50 py-8">暂无酒店，点击右上角「添加」录入</p>
          ) : (
          <div className="space-y-3 relative pl-5 border-l border-stone-200 dark:border-stone-800/60">
              {mergedHotels.map((merge, idx) => {
                const totalNights = merge.dates.length;
                const isSingleNight = totalNights === 1;
                const dateLabel = isSingleNight
                  ? formatDateLabel(merge.dates[0])
                  : `${formatDateLabel(merge.dates[0])} 至 ${formatDateLabel(merge.dates[merge.dates.length - 1])}`;

                const city = getCityFromAddress(merge.address, merge.hotelName);

                return (
                  <div key={idx} className="relative">
                    {/* 极简时间线点：细边空心灰圆，无颜色 */}
                    <div className="absolute -left-[23px] top-4 w-2 h-2 rounded-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600" />

                    <div className={`p-3.5 border transition-all ${
                      isCyber
                        ? 'border-[#00F5FF]/20 bg-black/40 hover:border-[#00F5FF] rounded-xl'
                        : isFrosted
                          ? 'border-white/10 bg-white/5 hover:border-purple-400/30 rounded-2xl'
                          : isNewspaper
                            ? 'border-2 border-[#1B1917] bg-[#FCFBF7] rounded-none hover:bg-stone-50'
                            : 'border-stone-200/60 bg-white dark:bg-stone-900/40 hover:bg-white rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                    }`}>
                      {/* Timeline head info */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                              {dateLabel} · {totalNights} 晚
                            </span>

                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded text-stone-500 dark:text-stone-400 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {city}
                            </span>
                          </div>

                          <h5 className="font-bold text-stone-900 dark:text-stone-100 text-sm truncate">
                            {merge.hotelName}
                          </h5>
                        </div>
                        <button
                          onClick={(e) => handleDeleteHotelStay(merge.ids, e)}
                          className="p-1 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                          title="删除该酒店入住"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Simplified Detail Block */}
                      <div className="mt-3.5 space-y-2.5 pt-3 border-t border-stone-200/30 dark:border-stone-800 text-[10px]">
                        {/* Address Action Section */}
                        <div className="flex flex-col gap-1.5 bg-stone-500/5 dark:bg-stone-500/10 p-2 rounded-lg border border-stone-200/5 dark:border-stone-800/10">
                          <div className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-[8px] text-stone-400 uppercase tracking-wider">酒店地址</span>
                              <span className="text-stone-700 dark:text-stone-300 text-[10px] font-medium leading-relaxed truncate" title={merge.address}>
                                {merge.address}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-1.5 border-t border-stone-200/25 dark:border-stone-800/20 pt-1.5">
                            <CopyButton 
                              textToCopy={merge.address} 
                              label="复制" 
                              variant={isCyber ? "cyber" : isFrosted ? "sky" : "stone"} 
                            />
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merge.hotelName + ' ' + merge.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded text-[9px] font-bold hover:bg-sky-500/20 transition-all flex items-center gap-1"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              Google 地图
                            </a>
                          </div>
                        </div>

                        {/* Phone if available */}
                        {merge.phone && (
                          <div className="flex items-center gap-2 bg-stone-500/5 dark:bg-stone-500/10 p-1.5 px-2 rounded-lg border border-stone-200/5 dark:border-stone-800/10">
                            <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span className="font-bold text-[8px] text-stone-400 uppercase tracking-wider shrink-0">酒店电话:</span>
                            <a
                              href={`tel:${merge.phone}`}
                              className="font-mono text-stone-700 dark:text-stone-300 hover:underline font-bold"
                            >
                              {merge.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          )}
          </div>
        </div>
      )}

      {/* RENDER TAB 2: 机票航线 (Flight Ticket Cards & Interactive Boarding Passes) */}
      {activeSubTab === 'flight' && (
        <div className="space-y-4">
          <BaggageAllowancePanel />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Plane className={`w-4 h-4 ${isCyber ? 'text-[#00F5FF]' : 'text-purple-400'}`} />
              <h4 className={`text-xs font-black ${isNewspaper ? 'font-serif text-[#1B1917]' : ''}`}>
                航班列表
              </h4>
            </div>

            <button
              onClick={() => showAddFlightForm ? closeFlightComposer() : openFlightComposer()}
              className={`py-1 px-2.5 text-[10px] flex items-center gap-1 cursor-pointer ${getSecondaryButtonStyle(theme.id)}`}
            >
              <Plus className="w-3 h-3" />
              <span>{showAddFlightForm ? '收起' : '添加'}</span>
            </button>
          </div>

          {showAddFlightForm && (
            <div className="space-y-3 animate-fadeIn">
              <input 
                ref={flightFileInputRef}
                type="file"
                accept="image/*,application/pdf,.txt"
                onChange={handleFlightFileInputChange}
                className="hidden"
              />

              <div className={`p-4 space-y-3 ${getCardStyle(theme.id, 'subcard')}`}>
                <p className="text-[10px] font-black">方式一 · 上传识别</p>

                {isScanningFlight ? (
                  <div className="py-6 space-y-3 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-7 h-7 text-sky-400 animate-spin" />
                    <p className="text-xs font-black">正在识别航班信息</p>
                    <p className="text-[9px] opacity-50">{scanStatusText || '识别成功后会直接加入列表'}</p>
                  </div>
                ) : (
                  <div 
                    onDragEnter={handleFlightDrag}
                    onDragOver={handleFlightDrag}
                    onDragLeave={handleFlightDrag}
                    onDrop={handleFlightDrop}
                    onClick={() => flightFileInputRef.current?.click()}
                    className={`border-2 border-dashed p-5 text-center cursor-pointer transition-all ${getDropzoneStyle(theme.id, flightDragActive)}`}
                  >
                    <UploadCloud className="w-7 h-7 text-stone-400 opacity-80 mx-auto" />
                    <p className="text-xs font-normal mt-2 text-stone-800 dark:text-stone-100">
                      点击上传登机牌、行程单图片或PDF，可自动解析航班信息
                    </p>
                  </div>
                )}

                {parseHint === 'empty' && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">
                      这份文件没有解析到航班信息。请改用下方「手动填写」，不用再传一次。
                    </p>
                  </div>
                )}
                {parseHint === 'partial' && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                    <Info className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-sky-700 dark:text-sky-300">
                      只识别到一部分，已填进下方表单，补全后点保存即可。
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 px-1 opacity-40">
                <div className="flex-1 h-px bg-current" />
                <span className="text-[9px] font-black">或</span>
                <div className="flex-1 h-px bg-current" />
              </div>

              <div className={`p-4 space-y-3 min-w-0 overflow-hidden ${getCardStyle(theme.id, 'subcard')}`}>
                  <form onSubmit={handleAddFlight} className="space-y-3 text-left min-w-0">
                    <p className="text-[10px] font-black">方式二 · 手动填写</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black opacity-75">航班号</label>
                        <input
                          type="text"
                          required
                          placeholder="如 SK4683"
                          value={newFlightNo}
                          onChange={(e) => setNewFlightNo(e.target.value)}
                          className={`w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black opacity-75">航司</label>
                        <input
                          type="text"
                          required
                          placeholder="如 北欧航空 SAS"
                          value={newAirline}
                          onChange={(e) => setNewAirline(e.target.value)}
                          className={`w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black opacity-75">出发机场</label>
                        <input
                          type="text"
                          required
                          placeholder="如 雷克雅未克 KEF"
                          value={newDepAirport}
                          onChange={(e) => setNewDepAirport(e.target.value)}
                          className={`w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black opacity-75">到达机场</label>
                        <input
                          type="text"
                          required
                          placeholder="如 奥斯陆 OSL"
                          value={newArrAirport}
                          onChange={(e) => setNewArrAirport(e.target.value)}
                          className={`w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <label className="text-[9px] font-black opacity-75">出发日期</label>
                      <input
                        type="date"
                        required
                        value={newDepDate}
                        onChange={(e) => setNewDepDate(e.target.value)}
                        className={`w-full min-w-0 max-w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 min-w-0">
                      <div className="space-y-1 min-w-0">
                        <label className="text-[9px] font-black opacity-75">起飞</label>
                        <input
                          type="time"
                          value={newDepTime}
                          onChange={(e) => setNewDepTime(e.target.value)}
                          className={`w-full min-w-0 max-w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <label className="text-[9px] font-black opacity-75">到达</label>
                        <input
                          type="time"
                          value={newArrTime}
                          onChange={(e) => setNewArrTime(e.target.value)}
                          className={`w-full min-w-0 max-w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 min-w-0">
                      <div className="space-y-1 min-w-0">
                        <label className="text-[9px] font-black opacity-75">座位</label>
                        <input
                          type="text"
                          placeholder="可选"
                          value={newSeatNo}
                          onChange={(e) => setNewSeatNo(e.target.value)}
                          className={`w-full min-w-0 max-w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                        />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <label className="text-[9px] font-black opacity-75">登机口</label>
                        <input
                          type="text"
                          placeholder="可选"
                          value={newGate}
                          onChange={(e) => setNewGate(e.target.value)}
                          className={`w-full min-w-0 max-w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <label className="text-[9px] font-black opacity-75">舱位</label>
                      <select
                        value={newClassType}
                        onChange={(e) => setNewClassType(e.target.value)}
                        className={`w-full min-w-0 max-w-full px-2.5 py-1.5 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                      >
                        <option value="经济舱">经济舱</option>
                        <option value="超级经济舱">超级经济舱</option>
                        <option value="公务舱">公务舱</option>
                        <option value="头等舱">头等舱</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className={`w-full py-2 text-xs cursor-pointer shadow-sm ${getPrimaryButtonStyle(theme.id)}`}
                    >
                      保存航班
                    </button>
                  </form>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {orderedFlights.length === 0 && !showAddFlightForm ? (
              <p className="text-center text-xs opacity-50 py-8">暂无航班，点击右上角「添加」录入</p>
            ) : (
              flightDateGroups.map((group) => (
                <div key={group.dateKey} className="space-y-2">
                  <p className={`text-[15px] font-medium tracking-tight px-0.5 ${
                    isMidnight || isCyber ? 'text-stone-100' : isFrosted ? 'text-white' : 'text-stone-800 dark:text-stone-100'
                  }`}>
                    {group.dateKey === '__pending' ? '日期待补' : renderLocalDate(group.flights[0].depDate)}
                  </p>
                  <div className="space-y-3">
              {group.flights.map((flight) => {
                const dep = splitAirport(flight.depAirport);
                const arr = splitAirport(flight.arrAirport);
                const baggageRule = getFlightAirlineRule(flight.airline, flight.flightNo);
                return (
                  <div
                    key={flight.id}
                    className={`relative overflow-hidden ${
                      isCyber
                        ? 'border border-[#00F5FF]/30 bg-black/70 rounded-2xl'
                        : isFrosted
                          ? 'border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl'
                          : isNewspaper
                            ? 'border-2 border-[#1B1917] bg-[#FCFBF7] rounded-none'
                            : isMidnight
                              ? 'border border-slate-700/80 bg-[#141A26] rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.35)]'
                              : 'border border-stone-200/70 bg-white rounded-2xl shadow-sm'
                    }`}
                  >
                    <div className="px-4 pt-3.5 pb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] opacity-45">Boarding Pass</p>
                        <p className="text-[11px] font-black truncate mt-0.5">{flight.airline}</p>
                        <p className="text-[9px] opacity-50 mt-0.5">{flight.classType || '经济舱'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-45">Flight</p>
                        <p className={`text-[26px] leading-none font-black font-mono tracking-wide mt-0.5 ${
                          isMidnight || isCyber ? 'text-sky-300' : isFrosted ? 'text-purple-200' : 'text-stone-900'
                        }`}>
                          {flight.flightNo}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-3 flex items-end justify-between gap-2">
                      <div className="min-w-0 text-left">
                        <p className="text-[32px] leading-none font-black tracking-tight">{dep.code}</p>
                        {dep.city && <p className="text-[10px] opacity-55 truncate max-w-[96px] mt-1">{dep.city}</p>}
                        <p className={`text-[22px] leading-none font-mono font-black mt-2 ${
                          isMidnight || isCyber ? 'text-sky-200' : 'text-stone-900 dark:text-stone-50'
                        }`}>
                          {flight.depTime || '--:--'}
                        </p>
                      </div>

                      <div className="flex-1 px-1 pb-7 min-w-[72px]">
                        <div className="relative h-[2px] border-t border-dashed border-stone-400/40 dark:border-slate-500/50">
                          <Plane className={`w-4 h-4 rotate-90 absolute left-1/2 -top-2 -translate-x-1/2 ${
                            isMidnight || isCyber ? 'text-sky-300 bg-[#141A26]' : 'text-stone-500 bg-white dark:bg-[#141A26]'
                          }`} />
                        </div>
                      </div>

                      <div className="min-w-0 text-right">
                        <p className="text-[32px] leading-none font-black tracking-tight">{arr.code}</p>
                        {arr.city && <p className="text-[10px] opacity-55 truncate max-w-[96px] mt-1 ml-auto">{arr.city}</p>}
                        <p className={`text-[22px] leading-none font-mono font-black mt-2 ${
                          isMidnight || isCyber ? 'text-sky-200' : 'text-stone-900 dark:text-stone-50'
                        }`}>
                          {flight.arrTime || '--:--'}
                        </p>
                      </div>
                    </div>

                    <div className="relative my-1">
                      <div className="border-t border-dashed border-stone-400/35 dark:border-slate-600/60" />
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-stone-100 dark:bg-[#0C0E14]" />
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-stone-100 dark:bg-[#0C0E14]" />
                    </div>

                    <div className="px-4 pt-2 pb-3 grid grid-cols-4 gap-2 text-center items-end">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider opacity-40">Gate</p>
                        <p className="text-[12px] font-mono font-black mt-0.5">{flight.gate || 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider opacity-40">Seat</p>
                        <p className="text-[12px] font-mono font-black mt-0.5">{flight.seatNo && !flight.seatNo.includes('TBD') ? flight.seatNo : 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-wider opacity-40">Class</p>
                        <p className="text-[12px] font-black mt-0.5 truncate">{flight.classType || '经济舱'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteFlight(flight.id, e)}
                        className="text-[10px] font-bold opacity-40 hover:opacity-100 hover:text-red-500 transition-colors cursor-pointer pb-0.5"
                      >
                        删除
                      </button>
                    </div>
                    {baggageRule && (
                      <div className="border-t border-dashed border-stone-300/50 bg-amber-400/5 px-4 py-3 dark:border-stone-700/60">
                        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-black text-amber-600 dark:text-amber-300">
                          <Luggage className="h-3.5 w-3.5" />
                          {baggageRule.shortName}行李额
                        </div>
                        <div className="space-y-1">
                          {getBaggageRuleLines(baggageRule).map((line) => {
                            const [scope, allowance] = line.split('｜');
                            return <p key={line} className="flex items-start gap-2 text-[9px] leading-relaxed"><span className={`shrink-0 rounded px-1.5 py-0.5 font-black ${scope === '每人' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-300' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>{scope}</span><span className="pt-0.5 font-bold text-stone-600 dark:text-stone-300">{allowance}</span></p>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* RENDER TAB 3: 预约票夹 (Ticket Clip Zone & Upload and Lights) */}
      {activeSubTab === 'ticket' && (
        <div className="space-y-4">
          {/* Header with Upload Toggle Button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <FolderOpen className={`w-4 h-4 ${isNewspaper ? 'text-[#1B1917]' : isCyber ? 'text-[#00F5FF]' : 'text-purple-400'}`} />
              <h4 className={`text-xs font-black ${isNewspaper ? 'font-serif text-[#1B1917]' : ''}`}>
                票根
              </h4>
            </div>

            <button
              type="button"
              onClick={() => setShowAddVoucherForm(!showAddVoucherForm)}
              className={`py-1 px-2.5 text-[10px] flex items-center gap-1 cursor-pointer ${getSecondaryButtonStyle(theme.id)}`}
            >
              <Plus className="w-3 h-3" />
              <span>{showAddVoucherForm ? '收起' : '添加'}</span>
            </button>
          </div>

          {/* Upload Zone & Form Container */}
          {showAddVoucherForm && (
            <form onSubmit={handleAddVoucher} className={`space-y-4 p-4 min-w-0 overflow-hidden animate-fadeIn ${getCardStyle(theme.id, 'subcard')}`}>
              <div className="space-y-3 min-w-0">
                {/* Title Input */}
                <div className="space-y-1 min-w-0">
                  <label className={`text-[10px] font-extrabold uppercase tracking-widest ${isNewspaper ? 'text-[#1B1917]' : 'opacity-70'}`}>
                    票根/文件标题
                  </label>
                  <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="如：杰古沙龙湖冰川游船门票 14:00"
                    className={`w-full min-w-0 max-w-full px-3 py-2 text-xs font-medium outline-none ${getInputStyle(theme.id)}`}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 min-w-0">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <label className={`text-[10px] font-extrabold uppercase tracking-widest ${isNewspaper ? 'text-[#1B1917]' : 'opacity-70'}`}>
                        使用日期
                      </label>
                      {useDate && (
                        <button
                          type="button"
                          onClick={() => setUseDate('')}
                          className="shrink-0 text-[10px] font-semibold text-stone-400 hover:text-stone-200 cursor-pointer"
                        >
                          清空
                        </button>
                      )}
                    </div>
                    <NativePickerField
                      type="date"
                      ariaLabel="使用日期"
                      value={useDate}
                      onChange={setUseDate}
                      placeholder="年 / 月 / 日"
                      inputClassName={getInputStyle(theme.id)}
                    />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <label className={`text-[10px] font-extrabold uppercase tracking-widest ${isNewspaper ? 'text-[#1B1917]' : 'opacity-70'}`}>
                        使用时间
                      </label>
                      {useTime && (
                        <button
                          type="button"
                          onClick={() => setUseTime('')}
                          className="shrink-0 text-[10px] font-semibold text-stone-400 hover:text-stone-200 cursor-pointer"
                        >
                          清空
                        </button>
                      )}
                    </div>
                    <NativePickerField
                      type="time"
                      ariaLabel="使用时间"
                      value={useTime}
                      onChange={setUseTime}
                      placeholder="--:--"
                      inputClassName={getInputStyle(theme.id)}
                    />
                  </div>
                </div>

                {/* File Drag-and-Drop Area */}
                <div className="space-y-1">
                  <label className={`text-[10px] font-extrabold uppercase tracking-widest ${isNewspaper ? 'text-[#1B1917]' : 'opacity-70'}`}>
                    导入PDF/预订截图
                  </label>
                  
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed p-5 text-center cursor-pointer transition-all relative ${
                      dragActive ? 'border-purple-400 bg-purple-500/10 rounded-xl' : getDropzoneStyle(theme.id)
                    }`}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,application/pdf,text/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />

                    {selectedFile ? (
                      <div className="space-y-1">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto animate-bounce" />
                        <p className="text-xs font-bold truncate max-w-full px-1">{selectedFile.name}</p>
                        <p className="text-[10px] opacity-60">大小: {formatBytes(selectedFile.size)}</p>
                        <p className="text-[9px] text-purple-400 font-semibold underline mt-1">点击重选</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <UploadCloud className="w-8 h-8 text-stone-400 mx-auto opacity-80" />
                        <p className="text-xs font-normal">点击选择本地预定截图，网页端支持拖拽传入</p>
                        <p className="text-[9px] opacity-65">文件将加密上传到共享云端</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {voucherError && <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-[10px] font-bold text-red-500">{voucherError}</p>}
              <button
                type="submit"
                disabled={!selectedFile || !title.trim() || isUploadingVoucher}
                className={`w-full py-2.5 text-xs flex items-center justify-center gap-1 cursor-pointer ${
                  !selectedFile || !title.trim() || isUploadingVoucher
                    ? 'opacity-40 cursor-not-allowed'
                    : getPrimaryButtonStyle(theme.id)
                }`}
              >
                {isUploadingVoucher ? '正在上传到共享云端…' : '🎟️ 塞入票根夹中'}
              </button>
            </form>
          )}

          {/* Grid List of Vouchers */}
          <div className="space-y-5">
            {vouchers.length === 0 && !showAddVoucherForm ? (
              <p className="text-center text-xs opacity-50 py-8">暂无票根，点击右上角「添加」录入</p>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {vouchers.map((item) => {
                  return (
                    <div
                      key={item.id}
                      onClick={async () => {
                        if (!item.filePath) {
                          onPreviewVoucher(item, vouchers);
                          return;
                        }
                        try {
                          const signedUrl = await getVoucherUrl(item.filePath);
                          const withUrl = { ...item, fileData: signedUrl };
                          onPreviewVoucher(withUrl, vouchers.map((voucher) => voucher.id === item.id ? withUrl : voucher));
                        } catch (error) {
                          setVoucherError(error instanceof Error ? error.message : '票据预览失败');
                        }
                      }}
                      className={`p-3 text-xs flex items-center justify-between transition-all cursor-pointer relative overflow-hidden group ${getCardStyle(theme.id, 'interactive')}`}
                    >
                      <div className="flex gap-2.5 items-center min-w-0 pr-2">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          item.fileType.startsWith('image/')
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                        }`}>
                          <FileText className="w-5 h-5" />
                        </div>

                        <div className="space-y-0.5 min-w-0">
                          <h6 className="font-extrabold truncate text-stone-800 dark:text-stone-100">{item.title}</h6>
                          {(item.useDate || item.useTime) && (
                            <p className="text-[10px] opacity-70">使用 {formatVoucherWhen(item.useDate, item.useTime)}</p>
                          )}
                          <p className="text-[9px] opacity-60 truncate">{item.fileName} • {item.fileSize}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button className="p-1 rounded-full text-stone-400 hover:text-purple-400 hover:bg-white/10 transition-colors cursor-pointer">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteVoucher(item.id, e)}
                          className="p-1 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apple-style vibrancy confirmation dialog — no backdrop scrim, floating frosted glass */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="absolute inset-0 flex items-center justify-center p-4 z-[200] pointer-events-none">
            <motion.div
              initial={{ scale: 1.12, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                default: { type: 'spring', damping: 26, stiffness: 340 },
                // 关闭时用极短的淡出替代 spring 回弹，避免"闪一下"
                exit: { duration: 0.08, ease: 'easeOut' }
              } as any}
              className={`pointer-events-auto w-[270px] rounded-2xl overflow-hidden relative flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_8px_20px_-8px_rgba(0,0,0,0.25)] ${
                isCyber
                  ? 'bg-[#0D0E15]/85 backdrop-blur-2xl backdrop-saturate-150 border border-white/10 text-white'
                  : isNewspaper
                    ? 'bg-[#FCFBF7]/95 backdrop-blur-xl border-2 border-[#1B1917] rounded-none text-[#1B1917]'
                    : 'bg-white/75 dark:bg-neutral-900/80 backdrop-blur-2xl backdrop-saturate-150 border border-black/5 dark:border-white/10 text-neutral-900 dark:text-white'
              }`}
              // Prevent bubbling to any outer handler
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title & message — center-aligned, iOS UIAlertController layout */}
              <div className="px-5 pt-4 pb-3.5 text-center">
                <h4 className="text-[15px] font-semibold leading-tight tracking-tight">
                  {confirmModal.title}
                </h4>
                <p className="mt-1.5 text-[13px] leading-snug opacity-70">
                  {confirmModal.message}
                </p>
              </div>

              {/* Buttons — hairline divider between */}
              <div className={`flex border-t ${
                isCyber ? 'border-white/10' : isNewspaper ? 'border-[#1B1917]' : 'border-black/10 dark:border-white/10'
              }`}>
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className={`flex-1 py-2.5 text-[15px] font-normal cursor-pointer transition-colors ${
                    isCyber
                      ? 'text-[#00F5FF] hover:bg-white/5'
                      : isNewspaper
                        ? 'text-[#1B1917] hover:bg-stone-100'
                        : 'text-blue-500 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  取消
                </button>
                <div className={`w-px ${
                  isCyber ? 'bg-white/10' : isNewspaper ? 'bg-[#1B1917]' : 'bg-black/10 dark:bg-white/10'
                }`} />
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                  }}
                  className={`flex-1 py-2.5 text-[15px] font-semibold cursor-pointer transition-colors ${
                    isCyber
                      ? 'text-[#FF007F] hover:bg-[#FF007F]/10'
                      : isNewspaper
                        ? 'text-[#1B1917] font-black hover:bg-stone-100'
                        : 'text-red-500 hover:bg-red-500/5'
                  }`}
                >
                  删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
