import React, { useState } from "react";
import { FloatButton, Modal, Space } from "antd";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { useTranslate } from "@refinedev/core";

interface ScannerProps {
  visible: boolean;
  onScan: (value: string) => void;
  onCancel: () => void;
}

const UPCScannerModal: React.FC<ScannerProps> = ({ visible, onScan, onCancel }) => {
  const [lastError, setLastError] = useState<string | null>(null);
  const t = useTranslate();

  return (
    <>
      <Modal destroyOnClose onCancel={() => onCancel()} footer={null} title={t("scanner.title")}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <QrScanner
            viewFinder={
              lastError
                ? () => (
                  <div
                    style={{
                      position: "absolute",
                      textAlign: "center",
                      width: "100%",
                      top: "50%",
                    }}
                  >
                    <p>{lastError}</p>
                  </div>
                )
                : undefined
            }
            onDecode={onScan}
            onError={(error: Error) => {
              console.error(error);
              if (error.name === "NotAllowedError") {
                setLastError(t("scanner.error.notAllowed"));
              } else if (
                error.name === "InsecureContextError" ||
                (location.protocol !== "https:" && navigator.mediaDevices === undefined)
              ) {
                setLastError(t("scanner.error.insecureContext"));
              } else if (error.name === "StreamApiNotSupportedError") {
                setLastError(t("scanner.error.streamApiNotSupported"));
              } else if (error.name === "NotReadableError") {
                setLastError(t("scanner.error.notReadable"));
              } else if (error.name === "NotFoundError") {
                setLastError(t("scanner.error.notFound"));
              } else {
                setLastError(t("scanner.error.unknown", { error: error.name }));
              }
            }}
          />
        </Space>
      </Modal>
    </>
  );
};

export default UPCScannerModal;
