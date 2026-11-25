/* 国标交通标志矢量库（GB 5768.2 风格，示意级重绘，颜色/形状/图案为准）
   用法：<span class="sign" data-sign="w-crosswalk"></span>
   页面加载时 app.js 调用 Signs.hydrate() 注入 SVG。
*/
(function () {
  "use strict";
  var REG = {};

  function wrap(label, inner) {
    return '<svg viewBox="0 0 100 100" role="img" aria-label="' + label + '">' + inner + "</svg>";
  }
  function glyph(g, color, scale, cx, cy) {
    return (
      '<g transform="translate(' + (cx || 50) + " " + (cy || 50) + ") scale(" + (scale || 0.56) +
      ') translate(-50 -50)" fill="none" stroke="' + color +
      '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">' +
      g.replace(/%C%/g, color) + "</g>"
    );
  }

  /* ---------- 外框 ---------- */
  var warn = function (label, g, fill) {
    return wrap(label,
      '<polygon points="50,7 93,87 7,87" fill="' + (fill || "#ffcf00") + '" stroke="#111" stroke-width="7" stroke-linejoin="round"/>' +
      glyph(g, "#111", 0.44, 50, 64));
  };
  var prohibit = function (label, g, slash) {
    var s = '<circle cx="50" cy="50" r="43" fill="#fff" stroke="#d7263d" stroke-width="9"/>' + glyph(g, "#111", 0.55);
    if (slash !== false) s += '<path d="M19 81L81 19" stroke="#d7263d" stroke-width="8" stroke-linecap="round"/>';
    return wrap(label, s);
  };
  var mandate = function (label, g) {
    return wrap(label, '<circle cx="50" cy="50" r="46" fill="#1769c9"/>' + glyph(g, "#fff", 0.58));
  };
  var square = function (label, g) {
    return wrap(label, '<rect x="3" y="3" width="94" height="94" rx="9" fill="#1769c9"/>' + glyph(g, "#fff", 0.72));
  };
  var textSign = function (label, txt, opt) {
    opt = opt || {};
    var fs = opt.fs || 34;
    return wrap(label,
      '<circle cx="50" cy="50" r="43" fill="' + (opt.fill || "#fff") + '" stroke="' + (opt.ring || "#d7263d") + '" stroke-width="9"/>' +
      '<text x="50" y="' + (50 + fs * 0.36) + '" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="' + fs +
      '" font-weight="800" fill="' + (opt.color || "#111") + '">' + txt + "</text>");
  };
  var release = function (label, g) {
    return wrap(label,
      '<circle cx="50" cy="50" r="43" fill="#fff" stroke="#9aa5b1" stroke-width="8"/>' +
      glyph(g, "#7b8794", 0.55) +
      '<path d="M19 81L81 19" stroke="#333" stroke-width="8" stroke-linecap="round"/>');
  };
  var banner = function (label, fill, inner) {
    return wrap(label, '<rect x="2" y="14" width="96" height="72" rx="9" fill="' + fill + '"/>' +
      '<rect x="2" y="14" width="96" height="4" rx="2" fill="#fff" opacity=".35"/>' + inner);
  };
  var txt = function (s, x, y, fs, color, weight) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-family="Arial,\'PingFang SC\',\'Microsoft YaHei\',sans-serif" font-size="' +
      fs + '" font-weight="' + (weight || 700) + '" fill="' + (color || "#fff") + '">' + s + "</text>";
  };

  /* ---------- 图案 ---------- */
  var G = {
    person: '<circle cx="50" cy="19" r="7.5" fill="%C%" stroke="none"/>' +
      '<path d="M50 30v21M50 37l-13 10M50 37l13 10M50 51l-11 22M50 51l11 22"/>',
    children: '<circle cx="36" cy="27" r="6" fill="%C%" stroke="none"/>' +
      '<path d="M36 34v14M36 38l-8 7M36 38l8 7M36 48l-7 15M36 48l7 15" stroke-width="6"/>' +
      '<circle cx="66" cy="18" r="6" fill="%C%" stroke="none"/>' +
      '<path d="M66 26v16M66 30l-8 7M66 30l8 7M66 42l-6 16M66 42l6 16" stroke-width="6"/>',
    car: '<path d="M13 66V55l9-17h34l13 17h17v11z" fill="%C%" stroke="none"/>' +
      '<circle cx="30" cy="70" r="7" fill="%C%" stroke="none"/><circle cx="72" cy="70" r="7" fill="%C%" stroke="none"/>',
    truck: '<rect x="10" y="34" width="46" height="32" rx="3" fill="%C%" stroke="none"/>' +
      '<path d="M58 44h14l14 14v8H58z" fill="%C%" stroke="none"/>' +
      '<circle cx="26" cy="70" r="7" fill="%C%" stroke="none"/><circle cx="78" cy="70" r="7" fill="%C%" stroke="none"/>',
    bike: '<circle cx="26" cy="66" r="14" stroke-width="6"/><circle cx="74" cy="66" r="14" stroke-width="6"/>' +
      '<path d="M26 66L40 42h10l24 24M40 42h20M54 33h12" stroke-width="6"/>',
    arrowUp: '<path d="M50 84V26M50 26L34 43M50 26l16 17" stroke-width="12"/>',
    left: '<path d="M62 84V55c0-11-9-20-20-20H28" stroke-width="11"/>' +
      '<path d="M37 22L20 34l17 13" stroke-width="11"/>',
    right: '<path d="M38 84V55c0-11 9-20 20-20h14" stroke-width="11"/>' +
      '<path d="M63 22l17 12-17 13" stroke-width="11"/>',
    uturn: '<path d="M34 82V46c0-11 9-20 20-20s20 9 20 20v24" stroke-width="10"/>' +
      '<path d="M62 70l12 14 12-14" stroke-width="10"/>',
    curves: '<path d="M50 86C20 74 80 62 50 50S20 26 50 14" stroke-width="9"/>',
    steep: '<path d="M16 78h68L16 34z" fill="%C%" stroke="none"/>',
    narrow: '<path d="M26 86L44 18M74 86L56 18" stroke-width="7"/>',
    bridge: '<path d="M20 78V32M80 78V32M20 36h60M20 72h60" stroke-width="6"/>',
    rock: '<path d="M10 84L46 30M46 30l14 54" stroke-width="6"/>' +
      '<circle cx="64" cy="46" r="6" fill="%C%" stroke="none"/><circle cx="76" cy="60" r="5" fill="%C%" stroke="none"/>' +
      '<circle cx="60" cy="73" r="4.5" fill="%C%" stroke="none"/>',
    wind: '<path d="M28 86V24" stroke-width="7"/>' +
      '<path d="M28 26h24l-7 9 7 9H28z" fill="%C%" stroke="none"/>' +
      '<path d="M60 58h18M56 70h24M64 46h14" stroke-width="5"/>',
    slip: '<path d="M26 58V50l6-12h24l8 12h12v8z" fill="%C%" stroke="none"/>' +
      '<circle cx="38" cy="62" r="5" fill="%C%" stroke="none"/><circle cx="70" cy="62" r="5" fill="%C%" stroke="none"/>' +
      '<path d="M12 84q10-9 20 0t20 0 20 0" stroke-width="5"/>',
    tunnel: '<path d="M20 84V52c0-17 13-30 30-30s30 13 30 30v32" stroke-width="7"/>' +
      '<path d="M20 84h60" stroke-width="7"/>',
    rail: '<path d="M14 86h72" stroke-width="6"/>' +
      '<rect x="30" y="26" width="40" height="30" rx="4" fill="%C%" stroke="none"/>' +
      '<rect x="36" y="34" width="12" height="10" fill="#fff" stroke="none"/><rect x="52" y="34" width="12" height="10" fill="#fff" stroke="none"/>' +
      '<path d="M30 62v10M70 62v10" stroke-width="6"/>' +
      '<circle cx="34" cy="78" r="5" fill="%C%" stroke="none"/><circle cx="66" cy="78" r="5" fill="%C%" stroke="none"/>',
    build: '<circle cx="50" cy="21" r="7" fill="%C%" stroke="none"/>' +
      '<path d="M50 31v18M50 36l-15 9M50 36l14 7M50 49l-10 26M50 49l12 24" stroke-width="6"/>',
    village: '<path d="M8 54l16-16 16 16v28H8z" fill="%C%" stroke="none"/>' +
      '<path d="M44 62l18-16 18 16v20H44z" fill="%C%" stroke="none"/>',
    animal: '<path d="M22 54c0-8 6-12 16-12h16c10 0 16 4 16 12v8H22z" fill="%C%" stroke="none"/>' +
      '<path d="M28 62v22M44 62v22M58 62v22M70 60v22" stroke-width="6"/>' +
      '<path d="M72 46l10-12M76 34l-2-8M76 34l8-2" stroke-width="5"/>',
    bump: '<path d="M10 68q20-22 40 0t40 0" stroke-width="8"/>',
    flood: '<path d="M10 62q10-9 20 0t20 0 20 0 20 0" stroke-width="6"/>' +
      '<path d="M10 78q10-9 20 0t20 0 20 0 20 0" stroke-width="6"/>',
    merge: '<path d="M38 86V46c0-12 5-20 12-26M62 86V46c0-12-5-20-12-26" stroke-width="7"/>',
    fork: '<path d="M50 88V56M50 56L30 36V16M50 56l20-20V16" stroke-width="7"/>',
    signal: '<rect x="34" y="12" width="32" height="64" rx="9" fill="%C%" stroke="none"/>' +
      '<circle cx="50" cy="27" r="6" fill="#fff" stroke="none"/><circle cx="50" cy="44" r="6" fill="#fff" stroke="none"/>' +
      '<circle cx="50" cy="61" r="6" fill="#fff" stroke="none"/><path d="M50 76v12" stroke-width="6"/>',
    cross: '<path d="M50 8v84M8 50h84" stroke-width="9"/>',
    round: '<path d="M50 24a26 26 0 1 1-18 8" stroke-width="7"/>' +
      '<path d="M32 32l-10-2 3-10" stroke-width="7"/>' +
      '<circle cx="50" cy="50" r="5" fill="%C%" stroke="none"/>',
    zebra: '<circle cx="50" cy="19" r="7" fill="%C%" stroke="none"/>' +
      '<path d="M50 29v18M50 35l-11 9M50 35l11 9M50 47l-9 18M50 47l9 18" stroke-width="6"/>' +
      '<path d="M16 82h68" stroke-width="7" stroke-dasharray="9 7"/>',
    keepRight: '<path d="M34 22v24c0 11 9 20 20 20h12" stroke-width="9"/>' +
      '<path d="M56 52l16 14-16 14" stroke-width="9"/>',
    horn: '<path d="M20 42h12L52 27v46L32 58H20z" fill="%C%" stroke="none"/>' +
      '<path d="M60 38q10 12 0 24M71 29q15 21 0 42" stroke-width="5"/>',
    crash: '<path d="M10 64V56l5-9h18l7 9h6v8z" fill="%C%" stroke="none"/>' +
      '<circle cx="20" cy="67" r="4.5" fill="%C%" stroke="none"/><circle cx="38" cy="67" r="4.5" fill="%C%" stroke="none"/>' +
      '<path d="M56 64V56l5-9h18l7 9h6v8z" fill="%C%" stroke="none"/>' +
      '<circle cx="66" cy="67" r="4.5" fill="%C%" stroke="none"/><circle cx="84" cy="67" r="4.5" fill="%C%" stroke="none"/>' +
      '<path d="M46 44l6-10M54 34l-4-8M58 46l8-6" stroke-width="5"/>',
    overtake: '<path d="M6 60V52l5-9h20l7 9h8v8z" fill="%C%" stroke="none"/>' +
      '<circle cx="16" cy="63" r="4.5" fill="%C%" stroke="none"/><circle cx="38" cy="63" r="4.5" fill="%C%" stroke="none"/>' +
      '<path d="M54 60V52l5-9h20l7 9h8v8z" fill="#d7263d" stroke="none"/>' +
      '<circle cx="64" cy="63" r="4.5" fill="#d7263d" stroke="none"/><circle cx="86" cy="63" r="4.5" fill="#d7263d" stroke="none"/>',
    twoCarsGrey: '<path d="M6 60V52l5-9h20l7 9h8v8z" fill="%C%" stroke="none"/>' +
      '<circle cx="16" cy="63" r="4.5" fill="%C%" stroke="none"/><circle cx="38" cy="63" r="4.5" fill="%C%" stroke="none"/>' +
      '<path d="M54 60V52l5-9h20l7 9h8v8z" fill="%C%" stroke="none"/>' +
      '<circle cx="64" cy="63" r="4.5" fill="%C%" stroke="none"/><circle cx="86" cy="63" r="4.5" fill="%C%" stroke="none"/>'
  };

  /* ---------- 警告 ---------- */
  REG["w-crosswalk"] = warn("注意行人", G.person);
  REG["w-children"] = warn("注意儿童", G.children);
  REG["w-cross"] = warn("十字交叉路口", G.cross);
  REG["w-roundabout"] = warn("环形交叉路口", G.round);
  REG["w-signal"] = warn("注意信号灯", G.signal);
  REG["w-curves"] = warn("连续弯路", G.curves);
  REG["w-steep"] = warn("陡坡", G.steep);
  REG["w-narrow"] = warn("窄路", G.narrow);
  REG["w-bridge"] = warn("窄桥", G.bridge);
  REG["w-rock"] = warn("注意落石", G.rock);
  REG["w-wind"] = warn("注意横风", G.wind);
  REG["w-slip"] = warn("易滑路面", G.slip);
  REG["w-tunnel"] = warn("隧道", G.tunnel);
  REG["w-rail"] = warn("无人看守铁路道口", G.rail);
  REG["w-build"] = warn("施工", G.build);
  REG["w-village"] = warn("村庄", G.village);
  REG["w-animal"] = warn("注意野生动物", G.animal);
  REG["w-bump"] = warn("路面高突", G.bump);
  REG["w-flood"] = warn("过水路面", G.flood);
  REG["w-merge"] = warn("合流", G.merge);
  REG["w-fork"] = warn("分流", G.fork);
  REG["w-accident"] = warn("交通事故管理", G.crash, "#f7a8c4");

  /* ---------- 禁令 ---------- */
  REG["p-noentry"] = wrap("禁止驶入",
    '<circle cx="50" cy="50" r="45" fill="#d7263d"/><rect x="17" y="43" width="66" height="14" rx="3" fill="#fff"/>');
  REG["p-nopass"] = wrap("禁止通行",
    '<circle cx="50" cy="50" r="43" fill="#fff" stroke="#d7263d" stroke-width="9"/>');
  REG["p-novehicle"] = prohibit("禁止机动车通行", G.car, false);
  REG["p-notruck"] = prohibit("禁止载货汽车通行", G.truck, false);
  REG["p-nobike"] = prohibit("禁止非机动车通行", G.bike, false);
  REG["p-left"] = prohibit("禁止左转弯", G.left);
  REG["p-right"] = prohibit("禁止右转弯", G.right);
  REG["p-uturn"] = prohibit("禁止掉头", G.uturn);
  REG["p-straight"] = prohibit("禁止直行", G.arrowUp);
  REG["p-overtake"] = prohibit("禁止超车", G.overtake, false);
  REG["p-horn"] = prohibit("禁止鸣喇叭", G.horn);
  REG["p-ebike"] = prohibit("禁止电动自行车进入", G.bike);
  REG["p-speed40"] = textSign("限制速度 40", "40");
  REG["p-speed60"] = textSign("限制速度 60", "60");
  REG["p-speed80"] = textSign("限制速度 80", "80");
  REG["p-height"] = textSign("限制高度 3.5 米", "3.5m", { fs: 22 });
  REG["p-weight"] = textSign("限制质量 10 吨", "10t", { fs: 26 });
  REG["p-noparking"] = wrap("禁止车辆停放",
    '<circle cx="50" cy="50" r="44" fill="#1769c9" stroke="#d7263d" stroke-width="9"/>' +
    '<path d="M23 77L77 23M77 77L23 23" stroke="#d7263d" stroke-width="8" stroke-linecap="round"/>');
  REG["p-nolongparking"] = wrap("禁止长时停车",
    '<circle cx="50" cy="50" r="44" fill="#1769c9" stroke="#d7263d" stroke-width="9"/>' +
    '<path d="M26 74L74 26" stroke="#d7263d" stroke-width="8" stroke-linecap="round"/>');
  REG["p-end-overtake"] = release("解除禁止超车", G.twoCarsGrey);
  REG["p-end-40"] = release("解除限制速度 40",
    '<text x="50" y="63" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="40" font-weight="800" fill="%C%">40</text>');

  /* ---------- 指示 ---------- */
  REG["m-straight"] = mandate("直行", G.arrowUp);
  REG["m-left"] = mandate("向左转弯", G.left);
  REG["m-right"] = mandate("向右转弯", G.right);
  REG["m-roundabout"] = mandate("环岛行驶", G.round);
  REG["m-keepright"] = mandate("靠右侧道路行驶", G.keepRight);
  REG["m-crosswalk"] = mandate("人行横道", G.zebra);
  REG["m-min60"] = textSign("最低限速 60", "60", { fill: "#1769c9", ring: "#1769c9", color: "#fff" });
  REG["s-oneway"] = square("单行路", G.arrowUp);
  REG["s-priority"] = square("干路先行",
    '<path d="M50 84V26M50 26L34 43M50 26l16 17" stroke-width="12"/>' +
    '<path d="M14 58h72" stroke-width="4"/>');
  REG["s-yieldcircle"] = wrap("会车让行",
    '<circle cx="50" cy="50" r="43" fill="#fff" stroke="#d7263d" stroke-width="9"/>' +
    '<path d="M34 78V30M34 30l-8 9M34 30l8 9" stroke="#111" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
    '<path d="M66 22v48M66 70l-8-9M66 70l8-9" stroke="#d7263d" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>');
  REG["s-prioritycircle"] = square("会车先行",
    '<path d="M34 78V30M34 30l-8 9M34 30l8 9" stroke-width="9"/>' +
    '<path d="M66 22v48M66 70l-8-9M66 70l8-9" stroke="#ff5252" stroke-width="9"/>');

  /* ---------- 让行（独立形状） ---------- */
  REG["s-stop"] = wrap("停车让行",
    '<polygon points="92,68 68,92 32,92 8,68 8,32 32,8 68,8 92,32" fill="#d7263d" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>' +
    '<text x="50" y="62" text-anchor="middle" font-family="\'PingFang SC\',\'Microsoft YaHei\',sans-serif" font-size="38" font-weight="800" fill="#fff">停</text>');
  REG["s-yield"] = wrap("减速让行",
    '<polygon points="8,18 92,18 50,90" fill="#fff" stroke="#d7263d" stroke-width="8" stroke-linejoin="round"/>' +
    '<text x="50" y="52" text-anchor="middle" font-family="\'PingFang SC\',\'Microsoft YaHei\',sans-serif" font-size="30" font-weight="800" fill="#111">让</text>');

  /* ---------- 指路 ---------- */
  REG["g-highway"] = banner("高速公路入口", "#007a4d",
    txt("高 速", 50, 48, 23) +
    '<path d="M50 76V60M50 60l-6 7M50 60l6 7" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>');
  REG["g-exit"] = banner("出口预告", "#007a4d",
    txt("出 口", 50, 46, 21) + txt("2 km", 50, 70, 16));
  REG["g-service"] = banner("服务区", "#007a4d",
    txt("P", 27, 60, 34) + txt("服务区", 63, 46, 16) + txt("2km", 63, 68, 13));
  REG["g-tunnel"] = banner("隧道", "#007a4d",
    txt("隧 道", 50, 46, 20) + txt("1.2 km", 50, 70, 14));
  REG["g-city"] = banner("城市道路指路", "#1769c9",
    txt("人民路", 50, 46, 20) + txt("← 1.5km", 50, 70, 14));
  REG["g-tour"] = banner("旅游区", "#8a5a2b",
    txt("景 区", 50, 46, 20) + txt("3 km", 50, 70, 15));
  REG["g-work"] = banner("作业区", "#e8720c",
    txt("施 工", 50, 46, 20) + txt("前方 500m", 50, 70, 13));

  window.Signs = {
    has: function (n) { return !!REG[n]; },
    get: function (n) { return REG[n] || ""; },
    hydrate: function (root) {
      var scope = root || document;
      var els = scope.querySelectorAll("[data-sign]");
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.getAttribute("data-done") === "1") continue;
        var s = REG[el.getAttribute("data-sign")];
        if (s) { el.innerHTML = s; el.setAttribute("data-done", "1"); }
      }
    }
  };
})();