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

interface AmIBotGraphqlResponse {
  user_current: {
      bot: boolean;
  }[]
}

export {
  PopoutPluginProps,
  VideoStreamsSubscriptionResultType,
  ScreenshareStreamsSubscriptionResultType,
  AmIBotGraphqlResponse,
};
