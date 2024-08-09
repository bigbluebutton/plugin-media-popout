import * as React from 'react';
import { useEffect } from 'react';

import {
  BbbPluginSdk,
  PluginApi,
  pluginLogger,
  ScreenshareHelperItemPosition,
  ScreenshareHelperButton,
  UserCameraDropdownOption,
  UserCameraDropdownSeparator,
} from 'bigbluebutton-html-plugin-sdk';
import { PopoutPluginProps, VideoStreamsSubscriptionResultType } from './types';
import { VIDEO_STREAMS_SUBSCRIPTION } from '../queries';
import { togglePopout } from './service';

function SampleUserCameraDropdownPlugin({ pluginUuid: uuid }: PopoutPluginProps):
React.ReactElement<PopoutPluginProps> {
  BbbPluginSdk.initialize(uuid);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);

  type PoppedMapping = {
    [streamId: string]: WindowProxy | null;
  };

  const [poppedStreams, setPoppedStreams] = React.useState<PoppedMapping>({});

  const { data: videoStreams } = pluginApi.useCustomSubscription<
    VideoStreamsSubscriptionResultType
  >(VIDEO_STREAMS_SUBSCRIPTION);

  const userCamera = pluginApi.useUserCameraDomElements(
    (videoStreams?.user_camera.map((vs) => vs.streamId)),
  );

  // pluginLogger.info(`logging the domElements manipulation for userCamera: (${userCamera}) for streams (${videoStreams})`);

  /* useEffect(() => {
    const popoutButton = new ScreenshareHelperButton({
      icon: 'popout_window',
      disabled: false,
      label: 'This will log on the console',
      tooltip: 'this is a button injected by plugin',
      position: ScreenshareHelperItemPosition.TOP_RIGHT,
      onClick: () => {
        pluginLogger.info('Logging from the screenshare extensible area');
      },
      hasSeparator: true,
    });

    pluginApi.setScreenshareHelperItems([popoutButton]);
  }, []); */

  const onClick = (params: { userId: string, streamId: string, browserClickEvent: React.MouseEvent<HTMLButtonElement> }) => {
    const { userId, streamId, browserClickEvent } = params;
    const streamIndex = Object.values(videoStreams.user_camera)
      .findIndex((camera) => camera.streamId === streamId);

    const newPopout = togglePopout(userCamera[streamIndex], streamId, videoStreams.user_camera[0]?.user?.name);
    poppedStreams[streamId] = newPopout;

    setPoppedStreams(poppedStreams);

    pluginApi.setUserCameraDropdownItems([
      new UserCameraDropdownOption({
        label: 'Popout video',
        icon: 'popout_window',
        displayFunction: ({ userId, streamId }) => {
          console.log('ESTOOOOOOOOOOOOOOU AQUI! ', userId, streamId, poppedStreams, poppedStreams[streamId]);
          const alreadyPopped = poppedStreams[streamId];
          return !alreadyPopped;
        },
        onClick,
      }),
    ]);

    if (newPopout) {
      newPopout?.addEventListener('beforeunload', () => {
        delete poppedStreams[streamId];
        setPoppedStreams(poppedStreams);

        pluginApi.setUserCameraDropdownItems([
          new UserCameraDropdownOption({
            label: 'Popout video',
            icon: 'popout_window',
            displayFunction: ({ userId, streamId }) => {
              const alreadyPopped = poppedStreams[streamId];
              return !alreadyPopped;
            },
            onClick,
          }),
        ]);
      });
    }
  };

  useEffect(() => {
    if (userCamera) {
      pluginApi.setUserCameraDropdownItems([
        new UserCameraDropdownOption({
          label: 'Popout video',
          icon: 'popout_window',
          displayFunction: ({ userId, streamId }) => {
            const alreadyPopped = poppedStreams[streamId];
            return !alreadyPopped;
          },
          onClick,
        }),
      ]);
    }
  }, [userCamera, poppedStreams]);

  return null;
}

export default SampleUserCameraDropdownPlugin;
