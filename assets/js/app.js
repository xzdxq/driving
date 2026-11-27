/* 站点通用逻辑：标志注入 / 答题闯关 / 进度 / 目录高亮 */
(function () {
  "use strict";

  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { window.localStorage.removeItem(k); } catch (e) {} }

  var LETTERS = ["A", "B", "C", "D", "E", "F"];
  var MOTION_KEY = "driving.motion";

  function mountQuiz(el, cfg) {
    if (typeof el === "string") el = document.querySelector(el);
    if (!el) return;
    var id = cfg.id || ("q" + Math.random().toString(36).slice(2, 7));
    var key = "driving.quiz." + id;
    var qs = cfg.qs || [];
    var saved = {};
    try { saved = JSON.parse(lsGet(key) || "{}") || {}; } catch (e) { saved = {}; }

    var head = document.createElement("div");
    head.className = "quiz-head";
    head.innerHTML =
      '<span class="qt">' + (cfg.title || "自测") + "</span>" +
      '<span class="qmeta">共 ' + qs.length + " 题 · 点选项立即判分</span>" +
      '<span class="qscore">0 / ' + qs.length + "</span>";

    var body = document.createElement("div");
    body.className = "quiz-body";

    var foot = document.createElement("div");
    foot.className = "quiz-foot";
    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "btn";
    resetBtn.textContent = "重做";
    var result = document.createElement("span");
    result.className = "quiz-result";
    result.setAttribute("aria-live", "polite");
    foot.appendChild(resetBtn);
    foot.appendChild(result);

    el.innerHTML = "";
    el.appendChild(head);
    el.appendChild(body);
    el.appendChild(foot);

    var state = { answered: 0, right: 0, wrong: [] };
    var nodes = [];

    qs.forEach(function (q, qi) {
      var box = document.createElement("div");
      box.className = "q";
      var qh = document.createElement("div");
      qh.className = "q-head";
      qh.innerHTML = '<span class="q-no">' + (qi + 1 < 10 ? "0" : "") + (qi + 1) + '</span><span class="q-text"></span>';
      qh.querySelector(".q-text").textContent = q.q;
      box.appendChild(qh);

      var opts = document.createElement("div");
      opts.className = "q-opts";
      var btns = [];
      q.o.forEach(function (text, oi) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "opt";
        b.innerHTML = '<span class="k">' + LETTERS[oi] + '</span><span class="t"></span>';
        b.querySelector(".t").textContent = text;
        b.addEventListener("click", function () { pick(qi, oi); });
        opts.appendChild(b);
        btns.push(b);
      });
      box.appendChild(opts);

      var why = document.createElement("div");
      why.className = "q-why";
      why.hidden = true;
      why.innerHTML = "<b>依据</b> " + (q.why || "");
      box.appendChild(why);

      nodes.push({ box: box, btns: btns, why: why, answered: false });
      body.appendChild(box);
    });

    function apply(qi, oi, silent) {
      var q = qs[qi];
      var n = nodes[qi];
      if (n.answered) return;
      n.answered = true;
      state.answered++;
      n.btns.forEach(function (b, i) {
        b.disabled = true;
        if (i === q.a) b.classList.add("ok");
        if (i === oi && oi !== q.a) b.classList.add("bad");
        if (i !== q.a && i !== oi) b.classList.add("dim");
      });
      n.why.hidden = false;
      if (oi === q.a) {
        state.right++;
      } else {
        state.wrong.push(qi + 1);
        if (!silent) n.box.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
      head.querySelector(".qscore").textContent = state.right + " / " + qs.length;
      saved[qi] = oi;
      lsSet(key, JSON.stringify(saved));
      lsSet("driving.score." + id, JSON.stringify({ r: state.right, n: qs.length }));
      if (state.answered === qs.length) {
        var msg = "完成：答对 " + state.right + " / " + qs.length;
        if (state.wrong.length) msg += " · 错题 " + state.wrong.join("、");
        if (state.right === qs.length) msg += " · 全对，可以进下一节";
        result.innerHTML = "<b>" + msg + "</b>";
      }
    }

    function pick(qi, oi) {
      var n = nodes[qi];
      if (n.answered) return;
      apply(qi, oi, false);
    }

    Object.keys(saved).forEach(function (k) {
      var qi = parseInt(k, 10);
      if (qi >= 0 && qi < qs.length && typeof saved[k] === "number") apply(qi, saved[k], true);
    });
    if (state.answered === qs.length && state.wrong.length === 0) {
      result.innerHTML = "<b>完成：答对 " + state.right + " / " + qs.length + " · 全对</b>";
    }

    resetBtn.addEventListener("click", function () {
      lsDel(key);
      lsDel("driving.score." + id);
      mountQuiz(el, cfg);
    });
  }

  function markSeen() {
    var m = document.body.getAttribute("data-mod");
    if (m) lsSet("driving.seen." + m, String(Date.now()));
  }

  function initToc() {
    var links = document.querySelectorAll(".toc a[href^='#']");
    if (!links.length) return;
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var secs = document.querySelectorAll(".sec[id]");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          links.forEach(function (x) { x.classList.remove("on"); });
          a.classList.add("on");
        }
      });
    }, { rootMargin: "-90px 0px -65% 0px", threshold: 0 });
    secs.forEach(function (s) { io.observe(s); });
  }

  function initChecks() {
    var boxes = document.querySelectorAll("input[type=checkbox][data-persist]");
    boxes.forEach(function (b) {
      var k = "driving.check." + b.getAttribute("data-persist");
      if (lsGet(k) === "1") b.checked = true;
      b.addEventListener("change", function () { lsSet(k, b.checked ? "1" : "0"); });
    });
  }

  function initIndex() {
    var cards = document.querySelectorAll(".mod[data-mod]");
    if (!cards.length) return;
    var done = 0;
    cards.forEach(function (c) {
      var m = c.getAttribute("data-mod");
      if (lsGet("driving.seen." + m)) {
        c.classList.add("done");
        var tag = c.querySelector(".num-tag");
        if (tag) tag.textContent = "✓ 已学过";
        done++;
      }
    });
    var p = document.getElementById("overall-progress");
    if (p) {
      p.style.width = Math.round((done / cards.length) * 100) + "%";
      var t = document.getElementById("overall-text");
      if (t) t.textContent = "已学 " + done + " / " + cards.length + " 个模块";
    }
    var route = document.querySelectorAll(".route-item[data-mod]");
    route.forEach(function (r) {
      if (lsGet("driving.seen." + r.getAttribute("data-mod"))) r.classList.add("done");
    });
  }

  function motionOff() { return lsGet(MOTION_KEY) === "off"; }

  function applyMotion() {
    var off = motionOff();
    document.documentElement.classList.toggle("motion-off", off);
    document.querySelectorAll("svg").forEach(function (s) {
      if (!s.pauseAnimations) return;
      if (off) s.pauseAnimations();
      else if (s.unpauseAnimations) s.unpauseAnimations();
    });
    var btn = document.getElementById("motion-btn");
    if (btn) {
      btn.textContent = off ? "播放动效" : "暂停动效";
      btn.setAttribute("aria-pressed", off ? "false" : "true");
      btn.title = off ? "播放页面里的动画" : "暂停页面里的动画";
    }
  }

  function initMotion() {
    var bar = document.querySelector(".topbar-inner");
    if (bar && !document.getElementById("motion-btn")) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.id = "motion-btn";
      btn.className = "motion-btn";
      btn.setAttribute("aria-label", "页面动效");
      btn.addEventListener("click", function () {
        lsSet(MOTION_KEY, motionOff() ? "on" : "off");
        applyMotion();
      });
      bar.appendChild(btn);
    }
    applyMotion();
  }

  function boot() {
    if (window.Signs) window.Signs.hydrate();
    initMotion();
    markSeen();
    initToc();
    initChecks();
    initIndex();
  }

  window.Driving = { quiz: mountQuiz, hydrate: boot };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();