/* Cumani Racing — race targets sheet: print-ready HTML (save as PDF) and a styled .xlsx.
   No libraries: the .xlsx is written by hand (XML parts in an uncompressed zip).
   Used by index.html as window.Targets; also loads in Node for testing. */
(function(root){
"use strict";

const STATE_COL={VIC:"1b1b1b",NSW:"9b2a1f",QLD:"a8832a",TAS:"4f7a3a",SA:"1f5a96",WA:"6b3fa0",NT:"8a5a2b",ACT:"1f5a96"};
const HEAD_FONT='Copperplate,"Copperplate Gothic Light","Copperplate Gothic",Cinzel,Georgia,serif';
const BODY_FONT='Optima,Candara,"Segoe UI","Gill Sans",sans-serif';
const COLS=[["Date",12.5],["Track",22],["Race Name",27],["Distance",9.5],["Age",7.5],["Sex",7],["Type",7.5],["Grade",7.5],["Prizemoney",11.5],["Path",6.5]];
const LEGEND=[["Ambitious Path","1"],["Expected Path","2",true],["Possible Path","3"],["Alternatives","-"]];

const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const money=n=>n?Math.round(n).toLocaleString("en-AU"):"-";
const colour=r=>STATE_COL[r.state]||"1b1b1b";

/* ---------------- print / PDF ---------------- */
function html(d){
  const cells=r=>[r.date,r.track,r.race,r.dist||"-",r.age||"-",r.sex||"-",r.type||"-",r.grade||"-",r.trial?"-":money(r.prize),r.path||""];
  const body=d.blocks.map((b,bi)=>
    (bi?`<tr class="gap"><td colspan="10"></td></tr>`:"")+
    b.map(r=>`<tr class="${r.trial?"trial":""}" style="color:#${colour(r)}">`+cells(r).map((v,i)=>`<td class="c${i}">${esc(v)}</td>`).join("")+`</tr>`).join("")
  ).join("");
  const c=d.contact||{};
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${esc(d.fileName||d.horse+" - Targets")}</title>
<style>
@page{size:A4 portrait;margin:11mm 11mm 10mm}
*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{margin:0;background:#fff;color:#1b1b1b}
body{font-family:${BODY_FONT};font-size:8.3pt}
.page{width:188mm;margin:0 auto;padding:4mm 0}
.top{display:flex;justify-content:space-between;align-items:flex-start}
.kicker{font-family:${HEAD_FONT};font-variant:small-caps;font-weight:700;font-size:15pt;letter-spacing:.6pt;margin-top:1mm}
.logo{height:15mm}
.title{text-align:center;margin:15mm 0 13mm}
.title h1{font-family:${HEAD_FONT};font-variant:small-caps;font-weight:700;font-size:23pt;letter-spacing:1.3pt;margin:0}
.title .ped{font-family:${HEAD_FONT};font-variant:small-caps;font-weight:700;font-size:9pt;letter-spacing:.8pt;margin-top:1mm}
table{width:100%;border-collapse:collapse;table-layout:fixed}
col.c0{width:11%}col.c1{width:18%}col.c2{width:21%}col.c3{width:8.5%}col.c4{width:6.5%}col.c5{width:6%}col.c6{width:6%}col.c7{width:6%}col.c8{width:10.5%}col.c9{width:6%}
th,td{border:1px solid #111;text-align:center;padding:0 1mm;height:7.4mm;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
thead tr.prep th{background:#fcf6dc;font-size:9.5pt;font-weight:700;height:5.6mm;position:relative;border-bottom:1px solid #111}
thead tr.prep .bm{position:absolute;right:1.5mm;top:0;bottom:0;display:flex;align-items:center;font-size:6.6pt;font-style:italic;font-weight:500}
thead tr.prep .bm b{margin-left:1mm;font-weight:700}
thead tr.hd th{background:#dfe5f2;font-size:8pt;font-weight:700;height:5.4mm;border-width:1px 1px 2px}
tr.lead td{border:0;height:3mm}
tr.gap td{border-left:0;border-right:0;height:3mm}
tr.trial td{font-style:italic;font-weight:400}
td.c9{font-style:italic}
.legend{display:flex;justify-content:flex-end;margin-top:3mm;border-top:1.2px solid #111;padding-top:2mm}
.legend table{width:auto;font-size:6.8pt}
.legend td{border:0;height:4.2mm;padding:0 2mm;text-align:right}
.legend td+td{border-left:1px solid #111;text-align:left;width:12mm;font-style:italic;padding-left:3mm}
.legend tr.b td:first-child{font-weight:700}
.foot{text-align:center;margin-top:9mm;font-family:${HEAD_FONT};font-variant:small-caps}
.foot img{height:15mm;display:block;margin:0 auto 4mm}
.foot .n{font-weight:700;font-size:8pt;letter-spacing:.5pt}
.foot .l{font-size:7.6pt;letter-spacing:.3pt;margin-top:.6mm}
.foot .l b{font-weight:700}
.bar{position:sticky;top:0;background:#14365c;color:#fff;font:600 14px system-ui,sans-serif;padding:10px 16px;display:flex;gap:12px;align-items:center;justify-content:space-between}
.bar button{font:inherit;background:#fff;color:#14365c;border:0;border-radius:6px;padding:7px 14px;cursor:pointer}
@media print{.bar{display:none}.page{padding:0}}
</style></head><body>
<div class="bar"><span>Targets sheet — choose “Save as PDF” in the print dialog</span><button onclick="print()">Print / Save PDF</button></div>
<div class="page">
<div class="top"><div class="kicker">${esc(d.heading)}</div><img class="logo" src="${esc(d.logoUrl)}" alt="Cumani Racing"></div>
<div class="title"><h1>${esc(d.horse)}</h1>${d.breeding?`<div class="ped">${esc(d.breeding)}</div>`:""}</div>
<table><colgroup>${COLS.map((_,i)=>`<col class="c${i}">`).join("")}</colgroup>
<thead><tr class="prep"><th colspan="10">${esc(d.prep)}<span class="bm">Current BM Rating:<b>${esc(d.rating)}</b></span></th></tr>
<tr class="hd">${COLS.map(c=>`<th>${c[0]}</th>`).join("")}</tr></thead>
<tbody><tr class="lead"><td colspan="10"></td></tr>${body}</tbody></table>
<div class="legend"><table>${LEGEND.map(l=>`<tr class="${l[2]?"b":""}"><td>${l[0]}</td><td>${l[1]}</td></tr>`).join("")}</table></div>
<div class="foot"><img src="${esc(d.monoUrl)}" alt=""><div class="n">${esc(c.name||"")}</div><div class="l">${c.line||""}</div><div class="l">${esc(c.contact||"")}</div></div>
</div>
<script>(function(){var im=[].slice.call(document.images),n=im.length;function go(){setTimeout(function(){print()},250)}
if(${d.autoPrint?"true":"false"}){if(!n)go();im.forEach(function(i){if(i.complete){if(!--n)go()}else{i.onload=i.onerror=function(){if(!--n)go()}}})}})();<\/script>
</body></html>`;
}

/* ---------------- minimal .xlsx writer ---------------- */
const xe=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"");
const colL=c=>{let s="";c++;while(c){const m=(c-1)%26;s=String.fromCharCode(65+m)+s;c=(c-m-1)/26|0}return s};
function Styles(){
  const fonts=['<font><sz val="10"/><name val="Optima"/></font>'], fills=['<fill><patternFill patternType="none"/></fill>','<fill><patternFill patternType="gray125"/></fill>'],
        borders=['<border><left/><right/><top/><bottom/><diagonal/></border>'], numFmts=[], xfs=['<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'], key={};
  const idx=(arr,x)=>{let i=arr.indexOf(x);if(i<0){arr.push(x);i=arr.length-1}return i};
  function id(s){
    s=s||{}; const k=JSON.stringify(s); if(key[k]!=null) return key[k];
    const f=s.font||{};
    const fi=idx(fonts,`<font>${f.b?"<b/>":""}${f.i?"<i/>":""}<sz val="${f.sz||10}"/><color rgb="FF${f.color||"1B1B1B"}"/><name val="${xe(f.name||"Optima")}"/></font>`);
    const fl=s.fill?idx(fills,`<fill><patternFill patternType="solid"><fgColor rgb="FF${s.fill}"/><bgColor indexed="64"/></patternFill></fill>`):0;
    const B=s.border||{}, side=(n,w)=>w?`<${n} style="${w}"><color rgb="FF111111"/></${n}>`:`<${n}/>`;
    const bo=s.border?idx(borders,`<border>${side("left",B.l)}${side("right",B.r)}${side("top",B.t)}${side("bottom",B.b)}<diagonal/></border>`):0;
    let nf=0; if(s.numFmt){ let j=numFmts.indexOf(s.numFmt); if(j<0){numFmts.push(s.numFmt);j=numFmts.length-1} nf=164+j; }
    const a=s.align||{};
    xfs.push(`<xf numFmtId="${nf}" fontId="${fi}" fillId="${fl}" borderId="${bo}" xfId="0" applyFont="1"${fl?' applyFill="1"':""}${bo?' applyBorder="1"':""}${nf?' applyNumberFormat="1"':""} applyAlignment="1"><alignment horizontal="${a.h||"center"}" vertical="${a.v||"center"}"${a.wrap?' wrapText="1"':""}${a.indent?` indent="${a.indent}"`:""}/></xf>`);
    return key[k]=xfs.length-1;
  }
  function xml(){
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">`+
      (numFmts.length?`<numFmts count="${numFmts.length}">${numFmts.map((f,i)=>`<numFmt numFmtId="${164+i}" formatCode="${xe(f)}"/>`).join("")}</numFmts>`:"")+
      `<fonts count="${fonts.length}">${fonts.join("")}</fonts><fills count="${fills.length}">${fills.join("")}</fills><borders count="${borders.length}">${borders.join("")}</borders>`+
      `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfs.length}">${xfs.join("")}</cellXfs>`+
      `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  }
  return {id,xml};
}
const CRC=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
function zip(files){ // [{name, data:Uint8Array}] stored, no compression
  const enc=new TextEncoder(), parts=[], cen=[]; let off=0;
  const u16=v=>[v&255,v>>8&255], u32=v=>[v&255,v>>8&255,v>>16&255,v>>>24&255];
  files.forEach(f=>{
    const nm=enc.encode(f.name), d=f.data, c=crc32(d);
    const h=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(c),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0)]);
    parts.push(h,nm,d);
    cen.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0x21),...u32(c),...u32(d.length),...u32(d.length),...u16(nm.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),nm);
    off+=h.length+nm.length+d.length;
  });
  const cs=cen.reduce((a,b)=>a+b.length,0);
  const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(cs),...u32(off),...u16(0)]);
  const all=parts.concat(cen,[end]), out=new Uint8Array(all.reduce((a,b)=>a+b.length,0)); let p=0; all.forEach(a=>{out.set(a,p);p+=a.length}); return out;
}
function pngSize(b){ return b&&b.length>24?{w:(b[16]<<24|b[17]<<16|b[18]<<8|b[19])>>>0,h:(b[20]<<24|b[21]<<16|b[22]<<8|b[23])>>>0}:{w:1,h:1}; }

function xlsx(d,logo,mono){ // logo, mono: Uint8Array PNG bytes (optional)
  const S=Styles(), rows={}, heights={}, merges=[];
  const set=(r,c,v,s)=>{ (rows[r]=rows[r]||{})[c]={v,s:S.id(s)}; };
  const area=(r1,c1,r2,c2,v,s)=>{ for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++) set(r,c,r===r1&&c===c1?v:null,s); if(r1!==r2||c1!==c2) merges.push(`${colL(c1)}${r1+1}:${colL(c2)}${r2+1}`); };
  const HF="Copperplate", BF="Optima", all={t:"thin",b:"thin",l:"thin",r:"thin"};
  let r=0;
  set(0,0,d.heading,{font:{name:HF,sz:16,b:1},align:{h:"left"}}); heights[0]=30; heights[1]=14; heights[2]=14;
  r=4; heights[3]=26;
  area(r,0,r,9,d.horse,{font:{name:HF,sz:24,b:1}}); heights[r]=34; r++;
  area(r,0,r,9,d.breeding||"",{font:{name:HF,sz:10,b:1}}); heights[r]=16; r++;
  heights[r]=26; r++; heights[r]=10; r++;
  // preparation bar
  const pb={fill:"FCF6DC",border:{t:"thin",b:"thin"}};
  set(r,0,null,{...pb,border:{t:"thin",b:"thin",l:"thin"}});
  area(r,1,r,7,d.prep,{...pb,font:{name:BF,sz:11,b:1}});
  area(r,8,r,9,`Current BM Rating:  ${d.rating}`,{...pb,border:{t:"thin",b:"thin",r:"thin"},font:{name:BF,sz:8,i:1},align:{h:"right"}});
  heights[r]=20; r++;
  COLS.forEach((c,i)=>set(r,i,c[0],{fill:"DFE5F2",border:{...all,b:"medium"},font:{name:BF,sz:10,b:1}})); heights[r]=19; r++;
  heights[r]=7; r++;
  d.blocks.forEach((b,bi)=>{
    if(bi){ for(let c=0;c<10;c++) set(r,c,null,{border:{t:"thin",b:"thin"}}); heights[r]=7; r++; }
    b.forEach(x=>{
      const f={name:BF,sz:10,color:colour(x).toUpperCase(),i:x.trial?1:0}, st={border:all,font:f};
      [x.date,x.track,x.race].forEach((v,i)=>set(r,i,v,st));
      set(r,3,x.dist||"-",st); set(r,4,x.age||"-",st); set(r,5,x.sex||"-",st); set(r,6,x.type||"-",st); set(r,7,x.grade||"-",st);
      set(r,8,!x.trial&&x.prize?Math.round(x.prize):"-",{...st,numFmt:"#,##0"});
      set(r,9,x.path||"",{...st,font:{...f,i:1}});
      heights[r]=22; r++;
    });
  });
  // rule + legend
  for(let c=0;c<10;c++) set(r,c,null,{border:{t:"medium"}}); heights[r]=6; r++;
  LEGEND.forEach(l=>{ set(r,8,l[0],{font:{name:BF,sz:8,b:l[2]?1:0},align:{h:"right",indent:1}}); set(r,9,l[1],{font:{name:BF,sz:8,i:1},align:{h:"left",indent:1},border:{l:"thin"}}); heights[r]=13; r++; });
  r++; heights[r]=50; const monoRow=r; r++;
  const c=d.contact||{};
  area(r,0,r,9,c.name||"",{font:{name:HF,sz:9,b:1}}); r++;
  area(r,0,r,9,(c.line||"").replace(/<[^>]+>/g,""),{font:{name:HF,sz:8}}); r++;
  area(r,0,r,9,c.contact||"",{font:{name:HF,sz:8}}); r++;
  const last=r-1;

  // sheet xml
  const sd=Object.keys(rows).map(Number).sort((a,b)=>a-b);
  const maxR=Math.max(last,...sd);
  let sheetData="";
  for(let i=0;i<=maxR;i++){
    const R=rows[i]; if(!R&&!heights[i]) continue;
    sheetData+=`<row r="${i+1}"${heights[i]?` ht="${heights[i]}" customHeight="1"`:""}>`;
    if(R) Object.keys(R).map(Number).sort((a,b)=>a-b).forEach(cn=>{
      const {v,s}=R[cn], ref=colL(cn)+(i+1);
      if(v==null||v==="") sheetData+=`<c r="${ref}" s="${s}"/>`;
      else if(typeof v==="number") sheetData+=`<c r="${ref}" s="${s}"><v>${v}</v></c>`;
      else sheetData+=`<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${xe(v)}</t></is></c>`;
    });
    sheetData+=`</row>`;
  }
  const pxW=w=>Math.trunc(w*7+5), colPx=COLS.map(c=>pxW(c[1])), totPx=colPx.reduce((a,b)=>a+b,0);
  const EMU=9525, pics=[];
  const anchor=(xPx,row,wPx,hPx,rid,id,name)=>{ // place at absolute x within row
    let col=0,acc=0; while(col<9&&acc+colPx[col]<=xPx){acc+=colPx[col];col++}
    return `<xdr:oneCellAnchor><xdr:from><xdr:col>${col}</xdr:col><xdr:colOff>${Math.round((xPx-acc)*EMU)}</xdr:colOff><xdr:row>${row}</xdr:row><xdr:rowOff>${2*EMU}</xdr:rowOff></xdr:from><xdr:ext cx="${Math.round(wPx*EMU)}" cy="${Math.round(hPx*EMU)}"/>`+
      `<xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${id}" name="${name}"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>`+
      `<xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${Math.round(wPx*EMU)}" cy="${Math.round(hPx*EMU)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`;
  };
  if(logo){ const z=pngSize(logo), h=54, w=h*z.w/z.h; pics.push({f:"image1.png",b:logo,x:anchor(totPx-w-2,0,w,h,"rId1",2,"Logo")}); }
  if(mono){ const z=pngSize(mono), h=58, w=h*z.w/z.h; pics.push({f:"image2.png",b:mono,x:anchor((totPx-w)/2,monoRow,w,h,"rId"+(pics.length+1),3,"Monogram")}); }
  const sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">`+
    `<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:J${maxR+1}"/><sheetViews><sheetView showGridLines="0" workbookViewId="0" zoomScale="110"/></sheetViews><sheetFormatPr defaultRowHeight="15"/>`+
    `<cols>${COLS.map((c,i)=>`<col min="${i+1}" max="${i+1}" width="${c[1]}" customWidth="1"/>`).join("")}</cols><sheetData>${sheetData}</sheetData>`+
    (merges.length?`<mergeCells count="${merges.length}">${merges.map(m=>`<mergeCell ref="${m}"/>`).join("")}</mergeCells>`:"")+
    `<printOptions horizontalCentered="1"/><pageMargins left="0.35" right="0.35" top="0.45" bottom="0.4" header="0.2" footer="0.2"/>`+
    `<pageSetup paperSize="9" orientation="portrait" fitToWidth="1" fitToHeight="0"/>${pics.length?'<drawing r:id="rId1"/>':""}</worksheet>`;
  const name=xe(String(d.sheetName||"Targets").replace(/[\\\/?*\[\]:]/g,"").slice(0,31)||"Targets");
  const enc=new TextEncoder(), F=(n,s)=>({name:n,data:typeof s==="string"?enc.encode(s):s});
  const R='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const files=[
    F("[Content_Types].xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${pics.length?'<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>':""}</Types>`),
    F("_rels/.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    F("xl/workbook.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="${R}"><bookViews><workbookView/></bookViews><sheets><sheet name="${name}" sheetId="1" r:id="rId1"/></sheets><definedNames><definedName name="_xlnm.Print_Area" localSheetId="0">'${name.replace(/'/g,"''")}'!$A$1:$J$${last+1}</definedName></definedNames></workbook>`),
    F("xl/_rels/workbook.xml.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${R}/styles" Target="styles.xml"/></Relationships>`),
    F("xl/worksheets/sheet1.xml",sheet),
    F("xl/styles.xml",S.xml())
  ];
  if(pics.length){
    files.push(F("xl/worksheets/_rels/sheet1.xml.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/drawing" Target="../drawings/drawing1.xml"/></Relationships>`));
    files.push(F("xl/drawings/drawing1.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="${R}">${pics.map(p=>p.x).join("")}</xdr:wsDr>`));
    files.push(F("xl/drawings/_rels/drawing1.xml.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${pics.map((p,i)=>`<Relationship Id="rId${i+1}" Type="${R}/image" Target="../media/${p.f}"/>`).join("")}</Relationships>`));
    pics.forEach(p=>files.push(F("xl/media/"+p.f,p.b)));
  }
  return zip(files);
}

/* ---------------- race -> sheet row ---------------- */
const AGEW={Two:2,Three:3,Four:4,Five:5,Six:6,Seven:7,Eight:8};
const SEX={"No sex restriction":"O","Fillies":"F","Fillies & Mares":"F&M","Mares":"M","C&G":"C&G","C,G&E":"C,G&E","E&G":"E&G"};
const WT={"Set Weights":"SW","Set Weights plus Penalties":"SWP","Handicap":"HCP","Quality":"QLTY","Standard Weight for Age":"WFA","Catch Weight":"CW","Highweight":"HW"};
const GRP={"Group 1":"Gr 1","Group 2":"Gr 2","Group 3":"Gr 3","Listed":"L","Restricted Listed":"RL"};
function age(s){
  if(!s||/No age/i.test(s)) return "Open";
  const n=[...s.matchAll(/(Two|Three|Four|Five|Six|Seven|Eight)-Years?-Old/g)].map(m=>AGEW[m[1]]);
  if(!n.length) return s;
  return /Upwards/i.test(s)?Math.min(...n)+"yo+":n.join("/")+"yo";
}
function grade(cls,grp){
  if(grp) return GRP[grp]||grp;
  if(!cls||cls==="No class restriction") return "-";
  if(cls==="Maiden") return "Mdn";
  let m; if((m=/^Class (\d)$/.exec(cls))) return "Cl "+m[1];
  if((m=/^0 - (\d+)$/.exec(cls))) return "0-"+m[1];
  return cls.length<=8?cls:"-";
}
/* racing.com often gives names in capitals: "MAGIC MILLIONS 2YO PLATE" -> "Magic Millions 2yo Plate" */
const KEEP=new Set(["MM","BM","VOBIS","QTIS","TAB","VRC","ATC","MRC","BRC","SAJC","WATC","TTC","TBV","TBWA","HCP","SW","SWP","WFA","QLD","NSW","VIC","SA","WA","TAS","NT","RSL","CFA","RC","TC","JC","II","III","IV"]);
function tidy(s){
  s=String(s||"").trim().replace(/\b(\d)-Y-O\b/gi,"$1yo").replace(/\s{2,}/g," "); const letters=s.replace(/[^A-Za-z]/g,"");
  if(!letters||letters!==letters.toUpperCase()) return s;
  return s.toLowerCase().replace(/[a-z0-9][a-z0-9'’&]*/g,w=>{
    const U=w.toUpperCase();
    if(KEEP.has(U)||/^BM\d+$/i.test(w)||/^[^aeiouy]+$/i.test(w)&&/[a-z]/.test(w)&&w.length<=4&&!/\d/.test(w)) return U;
    if(/^\d+yo$/.test(w)) return w;
    return w.charAt(0).toUpperCase()+w.slice(1);
  }).replace(/\b(\d)-y-o\b/gi,"$1yo").replace(/\b(Of|The|And|At|For|In)\b/g,(m,x,o)=>o?x.toLowerCase():x);
}
const pad=n=>String(n).padStart(2,"0");
const DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const SEASON=m=>m>=8&&m<=10?"Spring":m===11||m<=1?"Summer":m<=4?"Autumn":"Winter";
function row(r,path){
  const trial=r.cat==="Trial"||r.cat==="Jumpout";
  return {date:`${pad(r.date.getDate())} ${MON[r.date.getMonth()]}, ${DOW[r.date.getDay()]}`, track:`${r.vshort}, ${r.state}`, race:tidy(r.name), dist:r.dist,
    age:age(r.age), sex:SEX[r.sex]||r.sex||"O", type:trial?"-":(WT[r.wg]||r.wg||"-"), grade:trial?"-":grade(r.cls,r.grp),
    prize:trial?0:r.prize, path:path||"", state:r.state, trial, d:r.date};
}
/* trials first; then races split into blocks: Spring (Sep–Nov), Summer/Autumn (Dec–May), Winter (Jun–Aug) */
function blocks(rows){
  const tr=rows.filter(x=>x.trial).sort((a,b)=>a.d-b.d), rc=rows.filter(x=>!x.trial).sort((a,b)=>a.d-b.d);
  const key=d=>{const m=d.getMonth(), y=m>=7?d.getFullYear():d.getFullYear()-1; return y+(m>=8&&m<=10?"a":m===11||m<=4?"b":"c")};
  const out=[]; if(tr.length) out.push(tr);
  let cur=null,k=null; rc.forEach(x=>{const kk=key(x.d); if(kk!==k){cur=[];out.push(cur);k=kk} cur.push(x)});
  return out;
}
function heading(rows){
  const rc=rows.filter(x=>!x.trial).sort((a,b)=>a.d-b.d), seen=[];
  (rc.length?rc:rows).forEach(x=>{const s=SEASON(x.d.getMonth()); if(!seen.includes(s)) seen.push(s)});
  return (seen.join(" / ")||"Race")+" Targets";
}
function prep(rows){
  const d=rows.length?rows.reduce((a,b)=>a.d<b.d?a:b).d:new Date(), y=d.getMonth()>=7?d.getFullYear():d.getFullYear()-1;
  return `${y}/${String(y+1).slice(2)} Preparation`;
}

root.Targets={html,xlsx,row,blocks,heading,prep,STATE_COL};
if(typeof module!=="undefined") module.exports=root.Targets;
})(typeof window!=="undefined"?window:globalThis);
