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

export { PopoutPluginProps, VideoStreamsSubscriptionResultType };
