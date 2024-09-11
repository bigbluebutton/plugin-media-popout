interface PopoutPluginProps {
  pluginName: string,
  pluginUuid: string,
}

interface VideoStreamsSubscriptionResultType {
  user_camera?: {
    streamId: string
    user: {
      name: string
      userId: string
    };
  }[];
}

interface ScreenshareStreamsSubscriptionResultType {
  screenshare?: {
    stream: string
  }[];
}

export {
  PopoutPluginProps,
  VideoStreamsSubscriptionResultType,
  ScreenshareStreamsSubscriptionResultType,
};
