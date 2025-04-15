import {
  QRScanButton,
  QRScannerModalProvider,
  QRScannerWithResults,
  QRTextbox
} from "@/app/(main_outer)/(main)/scanner-testing/qrscanner";
import { QRCodeSVG } from "qrcode.react";


export default function ScanTestHome() {
  // return (<QRScannerWithResults qrCodeSuccessCallback={null} fps={15}/>)
  return (<QRScannerModalProvider fps={15} startopened={true} showTorchButtonIfSupported showZoomSliderIfSupported defaultZoomValueIfSupported={8}>
    <QRTextbox/>
    <QRScanButton/>
    <div className="bg-white">
    <QRCodeSVG width={undefined} height="82px" marginSize={4} value="https://app.oac.firstsa.org/person/67fd76dc10e35ed5f31977ac"/>
    <QRCodeSVG width={undefined} height="102.5px" marginSize={4} value="https://app.oac.firstsa.org/person/67fd76dc10e35ed5f31977ac"/>
    <QRCodeSVG width={undefined} height="123px" marginSize={4} value="https://app.oac.firstsa.org/person/67fd76dc10e35ed5f31977ac"/>
    <QRCodeSVG width={undefined} height="143.5px" marginSize={4} value="https://app.oac.firstsa.org/person/67fd76dc10e35ed5f31977ac"/>
    <QRCodeSVG width={undefined} height="164px" marginSize={4} value="https://app.oac.firstsa.org/person/67fd76dc10e35ed5f31977ac"/>
    </div>
  </QRScannerModalProvider>)
}
