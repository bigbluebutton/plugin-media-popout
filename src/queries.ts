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
