function hashCode(token) {
  let hash = 0;
  if (token.length === 0) return hash;

  // 模数为 2^32 (4294967296)。
  // 这将哈希值限制在 32 位无符号整数的范围内。
  const MODULUS_32BIT = 2 ** 32; // 4294967296

  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = hash * 31 + char;
    hash %= MODULUS_32BIT;
  }
  // 同样，确保结果是正数，但因为 MODULUS_32BIT 是 2的幂，
  // 实际上这里可以使用位操作来快速实现：hash >>> 0;
  // 但是为了通用性，仍使用 (hash % MOD + MOD) % MOD
  return ((hash % MODULUS_32BIT) + MODULUS_32BIT) % MODULUS_32BIT;
}

function hashColor(token) {
  const codes = token.split("").map((char) => char.charCodeAt(0));
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < codes.length; i++) {
    r = (r + codes[i] * 1) % 256;
    g = (g + codes[i] * 2) % 256;
    b = (b + codes[i] * 3) % 256;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * 十进制数字转二进制字符串
 * @param {*} number
 */
function dec2bit(number) {
  // 1. 输入验证
  if (!Number.isInteger(number) || number < 0) {
    throw new Error("Input must be a non-negative integer.");
  }

  // 2. 特殊情况：0 的二进制是 "0"
  if (number === 0) {
    return "0";
  }

  let binaryString = "";
  // 使用临时变量，避免修改原始参数
  let tempNumber = number;

  // 3. 核心转换逻辑：除二取余法
  // 循环直到数字变为0。
  // 每次迭代，取当前数字除以2的余数（即当前位的二进制值），
  // 然后将数字更新为除以2的商（向下取整）。
  // 余数需要从后往前添加，因为先得到的余数是最低位。
  while (tempNumber > 0) {
    const remainder = tempNumber % 2; // 获取当前最低位（0或1）
    binaryString = remainder + binaryString; // 将余数添加到字符串的前面
    tempNumber = Math.floor(tempNumber / 2); // 数字更新为商，继续处理下一位
  }

  return binaryString;
}

/**
 * 重复一个字符串直到满足指定的长度要求 (使用循环)
 * @param {string} str 要重复的字符串
 * @param {number} targetLength 目标长度
 * @returns {string} 重复后的字符串，长度等于 targetLength (如果 str 不为空且 targetLength > 0)
 */
function repeat2target(str, targetLength) {
  // 1. 处理边界情况
  if (targetLength <= 0) {
    return "";
  }
  if (!str) {
    // 如果 str 为空或 null/undefined
    return "";
  }

  // 如果原字符串长度已经足够或超过目标长度，直接截取并返回
  if (str.length >= targetLength) {
    return str.slice(0, targetLength);
  }

  let result = str;
  // 2. 循环拼接直到达到或超过目标长度
  while (result.length < targetLength) {
    result += str;
  }

  // 3. 截取到目标长度
  return result.slice(0, targetLength);
}

function makeRandomAvatar(token, randomColor) {
  const canvas = document.createElement("canvas", { class: "my-canvas" });
  const grid = 6;
  const cells = grid * grid;
  const pixelSize = 50;
  const padding = 50;
  canvas.id = "random-avatar-gen";
  canvas.height = pixelSize * grid + 2 * padding;
  canvas.width = pixelSize * grid + 2 * padding;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const hash = hashCode(token);
  const str = repeat2target(dec2bit(hash), cells);
  ctx.fillStyle = randomColor ? hashColor(token) : "#000";

  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      const index = i + j * grid;
      const char = str.charAt(index);
      if (char === "1") {
        const x = i * pixelSize + padding;
        const y = j * pixelSize + padding;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }

  const dataUrl = canvas.toDataURL("image/png");
  canvas.parentElement.removeChild(canvas);
  return dataUrl;
}

window.onload = () => {
  const container = document.getElementById("container");
  container.style.display = "flex";
  const image1 = document.getElementById("avatar1");
  const image2 = document.getElementById("avatar2");
  image1.src = makeRandomAvatar("hello");
  image2.src = makeRandomAvatar("hello", true);
  const input = document.getElementById("input");
  input.addEventListener("input", () => {
    const text = input.value;
    if (text) {
      image1.src = makeRandomAvatar(text);
      image2.src = makeRandomAvatar(text, true);
    }
  });
};
