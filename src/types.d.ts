type Metadata = {
  image: {
    Make: string;
    Model: string;
    Orientation: number;
    XResolution: number;
    YResolution: number;
    ResolutionUnit: number;
    Software: string;
    ModifyDate: string;
    YCbCrPositioning: number;
    Copyright: string;
    ExifOffset: number;
  };
  thumbnail: {
    Compression: number;
    Orientation: number;
    XResolution: number;
    YResolution: number;
    ResolutionUnit: number;
    ThumbnailOffset: number;
    ThumbnailLength: number;
    YCbCrPositioning: number;
  };
  exif: {
    FNumber: number;
    ExposureProgram: number;
    ISO: number;
    ExifVersion: Buffer;
    DateTimeOriginal: string;
    CreateDate: string;
    ComponentsConfiguration: Buffer;
    CompressedBitsPerPixel: number;
    ShutterSpeedValue: number;
    ApertureValue: number;
    BrightnessValue: number;
    ExposureCompensation: number;
    MaxApertureValue: number;
    MeteringMode: number;
    Flash: number;
    FocalLength: number;
    MakerNote: Buffer;
    FlashpixVersion: Buffer;
    ColorSpace: number;
    ExifImageWidth: number;
    ExifImageHeight: number;
    InteropOffset: number;
    FocalPlaneXResolution: number;
    FocalPlaneYResolution: number;
    FocalPlaneResolutionUnit: number;
    SensingMethod: number;
    FileSource: Buffer;
    SceneType: Buffer;
  };
  gps: any;
  interoperability: {
    InteropIndex: string;
    InteropVersion: Buffer;
  };
  makernote: {
    Version: Buffer;
    Quality: string;
    Sharpness: number;
    WhiteBalance: number;
    FujiFlashMode: number;
    FlashExposureComp: number;
    Macro: number;
    FocusMode: number;
    SlowSync: number;
    AutoBracketing: number;
    BlurWarning: number;
    FocusWarning: number;
    ExposureWarning: number;
  };
};

declare module 'exif-reader' {
  function exif(buffer: Buffer): Metadata;
  export = exif;
}

declare module 'exif' {
  type ExifInput = {
    image: Buffer;
  };

  type ExifCallback = (error: Error, data: Metadata) => void;

  export class ExifImage {
    constructor(image: ExifInput | Buffer, callback: ExifCallback);
  }
}
