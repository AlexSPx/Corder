import React, { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ImageCrop() {
  return createPortal(
    <div className="fixed top-0 m-0 h-screen w-screen"></div>,
    document.querySelector("#portal") as HTMLElement
  );
}
