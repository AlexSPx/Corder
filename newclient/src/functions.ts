export const b64toBlob = (b64Data: any, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export function compare(arr1: any, arr2: any) {
  if (!arr1 || !arr2) return;

  let result;

  arr1.forEach((e1: any, i: any) =>
    arr2.forEach((e2: any) => {
      if (e1.length > 1 && e2.length) {
        result = compare(e1, e2);
      } else if (e1 !== e2) {
        result = false;
      } else {
        result = true;
      }
    })
  );

  return result;
}
