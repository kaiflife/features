export const getUrlFromFile = async (file) => {
  if (!file) return;
  if (file?.url) return file.url;

  return window.URL.createObjectURL(file);
};

export const getExtensions = (extensions = ['txt', 'pdf', 'doc', 'docx', 'jpg']) =>
  extensions.map(extension => `.${extension}`).join(', ');

export const urlToFile = (url, filename) => (
  fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) =>
      new File([buf], filename, { type: (url.match(/^data:([^;]+);/) || '')[1] }))
);

export const formatDocumentInfo = async ({ fileName, href }) => {
  if (!fileName) return;
  if (href) return await urlToFile(href, fileName);

  return null;
};

export const openFileFolder = ({ id = 'inputFile', onChange }) => {
  let fileInputEl = document.body.querySelector('#inputFile');
  if (!fileInputEl) fileInputEl = document.createElement('input');

  fileInputEl.type = 'file';
  fileInputEl.id = id;
  fileInputEl.style.display = 'none';
  fileInputEl.accept = getExtensions();
  fileInputEl.onchange = (e => {
    onChange?.(e, e.target.files);
    e.target.remove();
  });
  fileInputEl.onblur = (e => e.target.remove());
  document.body.append(fileInputEl);
  fileInputEl.click();
};