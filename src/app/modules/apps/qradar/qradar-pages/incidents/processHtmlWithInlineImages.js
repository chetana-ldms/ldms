export function processHtmlWithInlineImages(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const imgTags = doc.querySelectorAll("img");

  const attachments = [];
  let index = 0;

  imgTags.forEach((img) => {
    if (img.src && img.src.startsWith("data:image")) {
      const fileName = `inline_${index}.png`;
      const contentId = fileName;
      const file = dataURLtoFile(img.src, fileName);

      // Replace base64 src with cid
      img.setAttribute("src", `cid:${contentId}`);

      attachments.push({ file, contentId });
      index++;
    }
  });

  const cleanedHtml = doc.body.innerHTML;
  return { cleanedHtml, attachments };
}

function dataURLtoFile(dataUrl, filename) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}
