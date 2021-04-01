const mammoth = require("mammoth");

export const extract = (file: any) => {
  mammoth.convertToHtml({ buffer: file }).then((res: any) => {
    return res.value;
  });
};
