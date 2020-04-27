////////

function eventCallback(e) {
  const eleSize = document.getElementsByClassName("box").length;

  for (let i = 1; i <= eleSize; i++) {
    update(e.x, e.y, i);
  }
}
window.addEventListener("mousemove", e => {
  eventCallback(e);
});
window.addEventListener("scroll", e => {
  eventCallback(e);
});

/**
 * css varにjsから値を渡す
 */
function setStyleProperty(property: string, value: string, itemId: number = 0) {
  if (itemId === 0) {
    // default ドキュメントrootに設定
    document.documentElement.style.setProperty(`--${property}`, value);
  } else {
    document
      .getElementById(`${itemId}`)
      .style.setProperty(`--${property}`, value);
  }
}

function update(mouseX: number = 0, mouseY: number = 0, itemId: number = 1) {
  // element stats
  const ele = document.getElementById(`${itemId}`).getBoundingClientRect();
  const rect = {
    center: {
      x: (ele.left + ele.right) / 2,
      y: (ele.bottom + ele.top) / 2
    }
  };

  // mouse stats
  let mouse = {
    position: {
      x: mouseX,
      y: mouseY
    },
    horizont: "",
    vertical: ""
  };

  if (mouse.position.x - rect.center.x > 0) {
    mouse.horizont = "right";
  } else {
    mouse.horizont = "left";
  }

  if (mouse.position.y - rect.center.y > 0) {
    mouse.vertical = "lower";
  } else {
    mouse.vertical = "upper";
  }

  // calc for style
  const beforeY =
    Math.floor(
      Math.atan2(
        rect.center.y - mouse.position.y,
        rect.center.x - mouse.position.x
      ) * 1000
    ) / 1000;
  const afterX = -1 * (beforeY - Math.PI / 2);
  setStyleProperty("beforeY", `${beforeY}rad`, itemId);
  setStyleProperty("afterX", `${afterX}rad`, itemId);

  if (mouse.horizont === "right") {
    setStyleProperty("beforeLeft", "0%", itemId);
    setStyleProperty("beforeRotate", "180deg", itemId);
    setStyleProperty("beforeTop", "100%", itemId);
  } else {
    setStyleProperty("beforeLeft", "100%", itemId);
    setStyleProperty("beforeRotate", "0deg", itemId);
    setStyleProperty("beforeTop", "0%", itemId);
  }

  if (mouse.vertical === "upper") {
    setStyleProperty("afterTop", "100%", itemId);
    setStyleProperty("afterRotate", "0deg", itemId);
    setStyleProperty("afterLeft", "0%", itemId);
  } else {
    setStyleProperty("afterTop", "0%", itemId);
    setStyleProperty("afterRotate", "180deg", itemId);
    setStyleProperty("afterLeft", "100%", itemId);
  }
}
