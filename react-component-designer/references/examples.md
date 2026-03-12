# Examples (trigger → pattern mix)

Use these as calibration examples when the user asks “幫我設計元件”.

## Example 1: Button

**User**: “幫我設計一個 Button，支援 variant/size/loading，並能當 Link 用。”  
**Pick**: props-driven + polymorphic/asChild  
**Why**: fixed structure; need variant knobs; underlying element must vary.

## Example 2: PageHeader

**User**: “PageHeader 要有標題、麵包屑、右側 actions，有時要換掉整個右側區塊。”  
**Pick**: props-driven + named slots  
**Why**: layout fixed; a few replaceable regions.

## Example 3: Tabs

**User**: “我要 Tabs，呼叫端想自由排 List/Content，並可受控 value。”  
**Pick**: compound + context + controlled/uncontrolled  
**Why**: multiple cooperating parts; flexible layout; state sync.

## Example 4: Table

**User**: “我要一個表格：固定上方 toolbar、空狀態、分頁；row 渲染要拿到 selection/hover 狀態。”  
**Pick**: named slots (toolbar/empty/footer) + renderRow + controlled selection  
**Why**: regions replaceable; per-row rendering needs ctx; selection often synced.

## Example 5: Combobox

**User**: “Combobox 要鍵盤操作完整、無障礙，UI 需要在不同產品線長不一樣。”  
**Pick**: headless hook + prop getters + optional thin UI wrapper  
**Why**: a11y & interaction heavy; multiple skins required.

