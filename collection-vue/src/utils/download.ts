export const download = (filename: string, url: string) => {
  let a = document.createElement('a');
  a.style.display = 'none';
  a.download = filename;
  a.href = url;
  document.body.appendChild(a);
  a.click(); // 触发a标签的click事件
  document.body.removeChild(a);
};
