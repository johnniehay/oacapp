import {
  QRScanButton,
  QRScannerModalProvider,
  QRScannerWithResults,
  QRTextbox
} from "@/app/(main_outer)/(main)/scanner-testing/qrscanner";
import { QRCodeSVG } from "qrcode.react";


export default function ScanTestHome() {
  // return (<QRScannerWithResults qrCodeSuccessCallback={null} fps={15}/>)
  return (<QRScannerModalProvider fps={15} startopened={true}>
    <QRTextbox/>
    <QRScanButton/>
    <QRCodeSVG width={undefined} height="50vh" marginSize={4} value="https://dev.oac.cids.org.za/qr/user/aaa"/>
  </QRScannerModalProvider>)
}
