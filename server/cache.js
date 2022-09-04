(() => {
  // src/new/framework.js
  var frag = Symbol();
  function dom(elem, props, ...children) {
    if (elem === frag)
      return children;
    if (typeof elem === "function")
      return elem({ ...props, children });
    return { ...props, elem, children };
  }
  var init = ($el, fn) => {
    let prevJson = { $el, elem: $el.nodeName.toLowerCase() }, tmp;
    const render = () => {
      $el.innerHTML = "";
      prevJson = El({
        $el,
        elem: $el.nodeName.toLowerCase()
      }, fn(), $el);
    };
    const El = (prev, cur, root) => {
      if (Array.isArray(cur))
        cur = { children: cur };
      if (typeof cur === "string")
        cur = { innerText: cur };
      cur.elem = cur.elem || "span";
      if (!prev || prev.elem !== cur.elem) {
        cur.$el = document.createElement(cur.elem);
        root.append(cur.$el);
      } else {
        cur.$el = prev.$el;
        cur.cleanup = prev.cleanup;
      }
      let {
        $el: $el2,
        elem,
        children,
        cleanup,
        ...rest
      } = cur;
      if (cleanup)
        for (let key in cleanup) {
          $el2.removeEventListener(key.substring(2), cur.cleanup[key]);
        }
      cur.cleanup = {};
      for (let key in rest) {
        if (typeof (tmp = rest[key]) == "undefined")
          continue;
        if (key.indexOf("on") != 0) {
          $el2[key] = tmp;
        } else {
          $el2.addEventListener(
            key.substring(2),
            cur.cleanup[key] = (e) => {
              rest[key](e);
            }
          );
        }
      }
      if (children)
        return {
          ...cur,
          children: children.map((child, i) => El(
            prev && prev.children && prev.children[i],
            child,
            $el2
          ))
        };
      return cur;
    };
    render();
    return render;
  };
  var framework_default = { frag, dom, init };

  // src/new/useBrowserData.js
  var socket = io();
  var storage = null;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      const json = window.localStorage.getItem(
        "user-data"
      );
      storage = JSON.parse(json);
    } catch (e) {
    }
  }
  var getStored = () => storage;
  var setStored = (data2) => {
    if (typeof window !== "undefined" && window.localStorage) {
      const json = JSON.stringify(data2);
      window.localStorage.setItem("user-data", json);
    }
    storage = data2;
  };
  var roomId = null;
  var presentationId = null;
  if (typeof document !== "undefined" && document.location) {
    const params = new URLSearchParams(
      document.location.search
    );
    roomId = params.get("r");
    presentationId = params.get("p");
  }
  if (roomId !== null && presentationId !== null) {
    socket.emit("control-connected", roomId);
    const { curSlide } = getStored() ?? { curSlide: 0 };
    const { ondevice } = getStored() ?? { ondevice: {} };
    const slideData = ondevice[presentationId];
    socket.emit(
      "presentation-start",
      { slideData, curSlide }
    );
  }
  var getRoomId = () => roomId;
  var setRoomId = (newRoomId) => {
    roomId = newRoomId;
  };
  var getPresentationId = () => presentationId;
  var setPresentationId = (newPresentationId) => {
    presentationId = newPresentationId;
  };
  var data;
  if (presentationId !== null) {
    const stored = getStored() ?? { ondevice: {} };
    if (stored.ondevice) {
      data = stored.ondevice[presentationId];
    } else {
      data = [""];
    }
  }
  var getData = () => data;
  var setData = (newData) => {
    if (presentationId === null) {
      throw new Error(
        `Trying to set data of unexisting presentation`
      );
    }
    data = newData;
    const stored = getStored() ?? { ondevice: {} };
    const oldOndevice = stored.ondevice;
    const changed = {};
    changed[presentationId] = newData;
    const ondevice = { ...oldOndevice, ...changed };
    setStored({ ...stored, ondevice });
  };
  var createRoomCallback = () => {
  };
  var currentRoom = null;
  var createRoom = (callback) => {
    socket.emit("create-room");
    currentRoom = null;
    createRoomCallback = callback;
  };
  socket.on("room-created", (qr, id) => {
    createRoomCallback(qr, id);
    currentRoom = id;
  });
  var onDataReceivedCallback = () => {
  };
  var onDataReceived = (callback) => {
    onDataReceivedCallback = callback;
  };
  socket.on("data-received", (data2) => {
    const stored = getStored() ?? { rooms: {} };
    const stored_rooms = stored.rooms;
    const new_room = {};
    new_room[currentRoom] = data2.slideData;
    const rooms = { ...stored_rooms, ...new_room };
    const newStored = {
      ...stored,
      rooms,
      curSlide: data2.curSlide
    };
    setStored(newStored);
    setRoomId(currentRoom);
    onDataReceivedCallback(data2);
  });
  var onSlideChangedCallback = () => {
  };
  var onSlideChanged = (callback) => {
    onSlideChangedCallback = callback;
  };
  socket.on("go-to-slide", (n) => {
    const stored = getStored() ?? {};
    const newStored = {
      ...stored,
      curSlide: data.curSlide
    };
    setStored(newStored);
    onSlideChangedCallback(n);
  });
  var setDataHook = (slideData) => {
    setData(slideData);
    const stored = getStored() ?? {};
    const curSlide = stored.curSlide ?? 0;
    const newStored = {
      ...stored,
      curSlide: data.curSlide
    };
    setStored(newStored);
    if (roomId !== null) {
      socket.emit(
        "presentation-start",
        { slideData, curSlide }
      );
    }
  };
  var setSlideHook = (curSlide) => {
    const stored = getStored() ?? {};
    if (stored.curSlide === curSlide) {
      return false;
    }
    setStored({
      ...stored,
      curSlide
    });
    socket.emit("go-to-slide", curSlide);
    return true;
  };
  var socketHooks = {
    createRoom,
    onDataReceived,
    onSlideChanged,
    setDataHook,
    setSlideHook
  };
  function useBrowserData() {
    return {
      getPresentationId,
      setPresentationId,
      getRoomId,
      setRoomId,
      getStored,
      setStored,
      getData,
      setData,
      socketHooks
    };
  }

  // src/new/components/Background.jsx
  function Background(props) {
    return /* @__PURE__ */ framework_default.dom("div", {
      id: "background-container"
    }, /* @__PURE__ */ framework_default.dom("div", {
      id: "background1"
    }), /* @__PURE__ */ framework_default.dom("div", {
      id: "background2"
    }), /* @__PURE__ */ framework_default.dom("div", {
      id: "background3"
    }));
  }

  // src/new/components/Icon.jsx
  function displayQr(qrcode2) {
    const qrcanvas = document.getElementById("qrcode");
    const ctx = qrcanvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    const data2 = qrcode2.modules;
    const size = data2.length;
    qrcanvas.width = qrcanvas.height = size + 2;
    const imageData = ctx.createImageData(size, size);
    data2.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const index = 4 * (rowIndex * size + cellIndex);
        imageData.data[index] = 0;
        imageData.data[index + 1] = 0;
        imageData.data[index + 2] = 0;
        imageData.data[index + 3] = cell * 255;
      });
    });
    ctx.putImageData(imageData, 1, 1);
  }
  function icon(props) {
    const { children, width, qrcode: qrcode2 } = props;
    const styleSizes = `width: ${width}px; height: ${width}px`;
    const styleCanvas = `width: ${width * 0.4}px; height: ${width * 0.4}px;position: relative; top: ${-width * 0.75}; left: ${width * 0.3}`;
    if (qrcode2) {
      setTimeout(() => displayQr(qrcode2), 100);
    }
    return {
      elem: "div",
      style: styleSizes,
      children: [
        /* @__PURE__ */ framework_default.dom("img", {
          style: styleSizes,
          src: "/assets/pres.svg"
        }),
        /* @__PURE__ */ framework_default.dom("canvas", {
          style: styleCanvas,
          id: "qrcode"
        })
      ]
    };
  }

  // src/new/components/FullCenter.jsx
  function FullCenter(props) {
    return {
      className: `full-center ${props.className}`,
      children: props.children
    };
  }

  // src/new/components/Button.jsx
  function Button(props) {
    const {
      type,
      width,
      height,
      color,
      ...rest
    } = props;
    const background = `background: linear-gradient(155deg, #0000, #0001), ${color};`;
    return {
      elem: "button",
      className: `button-${type}`,
      style: `width:${width};height:${height};${background}`,
      ...rest
    };
  }

  // src/new/components/Card.jsx
  function Card(props) {
    const { children, className } = props;
    const cn = `claycard ${className}`;
    return {
      elem: "div",
      className: "card-container",
      children: [{
        elem: "div",
        className: cn,
        children
      }]
    };
  }

  // src/new/components/Landing.jsx
  var qrcode = null;
  function CreateButton(props) {
    const { LandingContext, rerender: rerender2 } = props;
    const onclick = () => {
      const randomId = Date.now();
      LandingContext.setPresentationId(randomId);
      rerender2();
    };
    return /* @__PURE__ */ framework_default.dom(Button, {
      type: "pill",
      color: "#45ef45",
      onclick
    }, /* @__PURE__ */ framework_default.dom("div", {
      style: "display:flex;color:#efe;font-size:1.2rem;align-items:center;"
    }, /* @__PURE__ */ framework_default.dom("div", {
      style: "border-radius:100%;border:2px solid #efe;width:16px;height:16px;vertical-align:center;margin-right:4px;"
    }), "create"));
  }
  function H() {
    return /* @__PURE__ */ framework_default.dom("h1", {
      style: "margin:1rem;margin-top:1.5rem;"
    }, "Metaslides");
  }
  function Landing(props) {
    const { rerender: rerender2, LandingContext } = props;
    if (qrcode === null) {
      LandingContext.socketHooks.createRoom(
        (qr, id) => {
          console.log(id);
          qrcode = qr;
          rerender2();
        }
      );
      LandingContext.socketHooks.onDataReceived(rerender2);
    }
    return /* @__PURE__ */ framework_default.dom("div", {
      id: "root"
    }, /* @__PURE__ */ framework_default.dom(Background, null), /* @__PURE__ */ framework_default.dom("div", {
      id: "app-container",
      style: "font-family:Arial;color:412B2B;overflow:auto;"
    }, /* @__PURE__ */ framework_default.dom("div", {
      style: "display:flex;justify-content:space-between;"
    }, /* @__PURE__ */ framework_default.dom(H, null), /* @__PURE__ */ framework_default.dom("div", {
      style: "margin:1rem;"
    }, /* @__PURE__ */ framework_default.dom(CreateButton, {
      LandingContext,
      rerender: rerender2
    }))), /* @__PURE__ */ framework_default.dom(Card, {
      style: "margin-top:1rem;"
    }, /* @__PURE__ */ framework_default.dom("p", null, "\u{1F30C} Metaslides is a metaverse platform for giving ", " ", /* @__PURE__ */ framework_default.dom("u", null, "collaborative standup talks"), "."), /* @__PURE__ */ framework_default.dom("p", null, "\u{1FA82} It replaces traditional presentation and ", " ", /* @__PURE__ */ framework_default.dom("u", null, "enriches its' experience"), " ", " ", "by giving everyone ability participate."), /* @__PURE__ */ framework_default.dom("p", null, "\u{1F3D7}\uFE0F You can ", " ", /* @__PURE__ */ framework_default.dom("u", null, "add behaviours yourself"), " ", " ", "from building blocks like button, choice or text input. Make anonymous polls and receive results over email."), /* @__PURE__ */ framework_default.dom("p", null, "\u{1F680} fast and simple. ", " ", /* @__PURE__ */ framework_default.dom("u", null, "No rocket science involved"), ". You just type text and see changes in real time."), /* @__PURE__ */ framework_default.dom("p", {
      style: "margin-top:2rem;"
    }, "To create your own interactive experience scan QR code, or press ", /* @__PURE__ */ framework_default.dom("b", null, "Create"), " button.")), /* @__PURE__ */ framework_default.dom(FullCenter, {
      style: "margin-top:3rem;"
    }, /* @__PURE__ */ framework_default.dom(icon, {
      width: 320,
      qrcode
    }))));
  }

  // src/new/mmd.js
  function mmd(src) {
    var h = "";
    function escape(t) {
      return new Option(t).innerHTML;
    }
    function inlineEscape(s) {
      return escape(s).replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">').replace(/\[([^\]]+)]\(([^(]+?)\)/g, "$1".link("$2")).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, "<strong>$2</strong>").replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>");
    }
    src.replace(/^\s+|\r|\s+$/g, "").replace(/\t/g, "    ").split(/\n\n+/).forEach(function(b, f, R) {
      f = b[0];
      R = {
        "*": [/\n\* /, "<ul><li>", "</li></ul>"],
        "1": [/\n[1-9]\d*\.? /, "<ol><li>", "</li></ol>"],
        " ": [/\n    /, "<pre><code>", "</code></pre>", "\n"],
        ">": [/\n> /, "<blockquote>", "</blockquote>", "\n"]
      }[f];
      h += R ? R[1] + ("\n" + b).split(R[0]).slice(1).map(R[3] ? escape : inlineEscape).join(R[3] || "</li>\n<li>") + R[2] : f == "#" ? "<h" + (f = b.indexOf(" ")) + ">" + inlineEscape(b.slice(f + 1)) + "</h" + f + ">" : f == "<" ? b : "<p>" + inlineEscape(b) + "</p>";
    });
    return h;
  }

  // src/new/components/Presentation.jsx
  function Presentation(props) {
    const { className, data: data2 } = props;
    return {
      elem: "section",
      id: "pres-root",
      style: "margin: 0, width: 100%; height: 100%; display: flex; justify-content: center;",
      className,
      children: [{
        elem: "article",
        className: "markdown-body",
        innerHTML: mmd(data2)
      }]
    };
  }

  // src/new/components/EditorTextarea.jsx
  function EditorTextarea(props) {
    const { data: data2, oninput, onfocus } = props;
    return {
      elem: "textarea",
      value: data2,
      oninput,
      onfocus
    };
  }

  // src/new/components/Editor.jsx
  function asyncify(fn) {
    return new Promise((res, rej) => {
      try {
        fn();
        res();
      } catch (e) {
        rej();
      }
    });
  }
  function rerenderThenFocusNthTextarea(rerender2, n) {
    asyncify(rerender2).then(() => {
      const textareas = document.querySelectorAll(
        "textarea"
      );
      const textarea = textareas[n];
      if (textarea) {
        textarea.focus();
        textarea.scrollIntoView();
      }
    });
  }
  function Plus(props) {
    return {
      elem: "button",
      innerText: "+",
      ...props
    };
  }
  function Editor(props) {
    const {
      HostContext,
      data: data2,
      className,
      rerender: rerender2
    } = props;
    const cleanData = data2 ?? [];
    if (cleanData.length === 0 || cleanData[cleanData.length - 1].trim() !== "") {
      cleanData.push("");
    }
    function changeData(index, value) {
      if (value) {
        const newData = cleanData;
        newData[index] = value;
        HostContext.socketHooks.setDataHook(newData);
        rerenderThenFocusNthTextarea(rerender2, index);
      } else {
        const newData = cleanData;
        newData.splice(index, 1);
        HostContext.socketHooks.setDataHook(newData);
        rerenderThenFocusNthTextarea(rerender2, index);
      }
    }
    function addToData(beforeIndex) {
      const newData = cleanData;
      newData.splice(beforeIndex, 0, "");
      HostContext.socketHooks.setDataHook(newData);
      rerenderThenFocusNthTextarea(
        rerender2,
        beforeIndex
      );
    }
    function goTo(index) {
      const isUpdated = HostContext.socketHooks.setSlideHook(index);
      if (isUpdated) {
        rerenderThenFocusNthTextarea(rerender2, index);
      }
    }
    const children = cleanData.reduce(
      (children2, slide, index) => {
        const textarea = EditorTextarea({
          data: slide,
          oninput: (e) => changeData(index, e.target.value),
          onfocus: () => goTo(index)
        });
        if (index > 0) {
          return [
            ...children2,
            /* @__PURE__ */ framework_default.dom(Plus, {
              onclick: () => addToData(index)
            }),
            textarea
          ];
        }
        return [...children2, textarea];
      },
      []
    );
    const slidesJsx = {
      elem: "div",
      className,
      style: "display:flex;flex-direction:column;overflow:auto;",
      children
    };
    return slidesJsx;
  }

  // src/new/components/Host.jsx
  function Host(props) {
    const {
      isOnline,
      HostContext,
      data: data2,
      rerender: rerender2,
      curSlide
    } = props;
    document.body.onresize = rerender2;
    const width = document.body.offsetWidth;
    const PresentationJsx = /* @__PURE__ */ framework_default.dom(Presentation, {
      data: data2[curSlide]
    });
    const EditorJsx = /* @__PURE__ */ framework_default.dom(framework_default.frag, null, isOnline ? "Presenting. You are presenter" : "Editing presentation without presenting", /* @__PURE__ */ framework_default.dom(Editor, {
      HostContext,
      data: data2,
      rerender: rerender2
    }));
    if (width > 640 || true) {
      return {
        elem: "div",
        id: "root",
        style: "width:100%;display:flex;justify-content:center;",
        children: [
          /* @__PURE__ */ framework_default.dom("div", {
            style: "overflow:auto;width:320px;"
          }, EditorJsx),
          /* @__PURE__ */ framework_default.dom("div", {
            style: "overflow:auto;width:320px;border:1px solid #ccc;"
          }, PresentationJsx)
        ]
      };
    }
  }

  // src/new/index.js
  var rerender;
  var {
    getPresentationId: getPresentationId2,
    setPresentationId: setPresentationId2,
    getRoomId: getRoomId2,
    setRoomId: setRoomId2,
    getStored: getStored2,
    setStored: setStored2,
    getData: getData2,
    setData: setData2,
    socketHooks: socketHooks2
  } = useBrowserData();
  var App = () => {
    const roomId2 = getRoomId2();
    const presentationId2 = getPresentationId2();
    if (presentationId2 === null && roomId2 !== null) {
      const stored = getStored2() ?? { rooms: {} };
      const slides = stored.rooms[roomId2] ?? [""];
      const curSlide = stored.curSlide ?? 0;
      const data2 = slides[curSlide];
      return /* @__PURE__ */ framework_default.dom("div", {
        id: "root"
      }, /* @__PURE__ */ framework_default.dom(Presentation, {
        data: data2
      }));
    } else if (presentationId2 === null && roomId2 === null) {
      return Landing({
        rerender: () => rerender(),
        LandingContext: {
          socketHooks: socketHooks2,
          setPresentationId: setPresentationId2
        }
      });
    } else if (presentationId2 !== null) {
      const isOnline = roomId2 !== null;
      const data2 = getData2();
      const stored = getStored2() ?? { rooms: {} };
      const curSlide = stored.curSlide ?? 0;
      return Host({
        isOnline,
        data: data2,
        HostContext: {
          socketHooks: socketHooks2
        },
        rerender: () => rerender(),
        curSlide
      });
    }
  };
  rerender = framework_default.init(
    document.getElementById("root"),
    App
  );
})();
