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

export function downloadBlobFileOnClick(data, fileName) {
  const href = typeof data === 'string' ? data : window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.setAttribute('href', href);
  link.setAttribute('target', '_blank');
  link.setAttribute('download', fileName);
  link.click();
  document.body.removeChild(link);
}

export const getFileExtensions = (
  extensions = ['pdf', 'doc', 'docx'],
) => extensions.map((extension) => `.${extension}`).join(', ');

export const getUrlFromFile = (file) => {
  if (!file) return;
  if (file?.url) return file.url;

  return window.URL.createObjectURL(file);
};

export function blobToFile(theBlob, fileName) {
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

export function removeFileFromFileList(index, input) {
  const dt = new DataTransfer();
  const { files } = input;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (index !== i) dt.items.add(file);
  }

  input.files = dt.files;
}

export function removeAllInputFiles(input) {
  const dt = new DataTransfer();

  input.files = dt.files;
}
