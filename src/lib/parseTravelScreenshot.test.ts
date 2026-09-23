import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseTravelScreenshotText } from './parseTravelScreenshot.ts';

describe('travel screenshot parsing', () => {
  it('classifies Xiaohongshu-style sections', () => {
    const result = parseTravelScreenshotText(`巴塞罗那两日攻略\n景点：\n圣家堂\nEl Born 老城\n备选景点：\n桂尔公园\n美食：\nPaco Meralgo Barcelona\nNomad Coffee\n购物：\nLa Chinata Barcelona\nZara Passeig de Gràcia\n收藏 1288`);
    assert.deepEqual(result.sights, ['圣家堂', 'El Born 老城']);
    assert.deepEqual(result.alternativeSights, ['桂尔公园']);
    assert.deepEqual(result.dining, ['Paco Meralgo Barcelona', 'Nomad Coffee']);
    assert.deepEqual(result.shopping, ['La Chinata Barcelona', 'Zara Passeig de Gràcia']);
  });

  it('recognizes known spots embedded in descriptive lines', () => {
    const result = parseTravelScreenshotText('下午去 Reinebringen 徒步，之后到 Hamnøy Bridge 拍红房子\n晚餐 Anitas Sjømat\nREMA 1000 采购');
    assert.deepEqual(result.sights, ['Reinebringen', 'Hamnøy Bridge']);
    assert.deepEqual(result.dining, ['晚餐 Anitas Sjømat']);
    assert.deepEqual(result.shopping, ['REMA 1000 采购']);
  });

  it('recognizes editor-style section labels with parenthetical hints', () => {
    const result = parseTravelScreenshotText(`景点（每行一个）\n圣家堂\nEl Born 老城\n备选景点（每行一个）\n桂尔公园\n餐饮安排（每行一家，可跳转地图）\nPaco Meralgo Barcelona\n购物推荐（每行一个，可跳转地图）\nLa Chinata Barcelona\n保存并同步`);
    assert.deepEqual(result.sights, ['圣家堂', 'El Born 老城']);
    assert.deepEqual(result.alternativeSights, ['桂尔公园']);
    assert.deepEqual(result.dining, ['Paco Meralgo Barcelona']);
    assert.deepEqual(result.shopping, ['La Chinata Barcelona']);
  });

  it('handles spaces and noise produced by Chinese OCR', () => {
    const result = parseTravelScreenshotText(`景点 (B71)\nNomad Coffee\nEl Born 老 城\n圣 玛 利 亚 德尔 马 教堂\nZz mits Zz\n备 选 景点 (每 行 一 个 )\n巴塞 罗 那 哥 特区\n桂 尔 公园\nLI\n餐饮 安排 《每 行 一 家 ， 可 跳 转 地 图 )\nL'Arrosseria Xativa Sant Antoni\nPaco Meralgo Barcelona\nVi\n购物 推荐 《每 行 一 个 ， 可 跳 转 地 图 )\nEI Born 独立 设计 店\nSanta Caterina Market Barcelona\nLa Chinata Barcelona\nB 保存 并 同步`);
    assert.deepEqual(result.sights, ['Nomad Coffee', 'El Born 老城', '圣玛利亚德尔马教堂']);
    assert.deepEqual(result.alternativeSights, ['巴塞罗那哥特区', '桂尔公园']);
    assert.deepEqual(result.dining, ["L'Arrosseria Xativa Sant Antoni", 'Paco Meralgo Barcelona']);
    assert.deepEqual(result.shopping, ['El Born 独立设计店', 'Santa Caterina Market Barcelona', 'La Chinata Barcelona']);
  });
});
