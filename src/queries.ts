export const VIDEO_STREAMS_SUBSCRIPTION = `subscription VideoStreams {
  user_camera {
    streamId
    user {
      name
      userId
    }
  }
}`;

export const SCREENSHARE_STREAM_SUBSCRIPTION = `subscription Screenshare {
  screenshare {
    stream
  }
}`;

export const AM_I_BOT_SUBSCRIPTION = `subscription UserBotSubscription {
  user_current {
    bot
  }
}`;
