import * as React from 'react';
import { useEffect } from 'react';
import { createIntl, defineMessages } from 'react-intl';
import {
  BbbPluginSdk,
  PluginApi,
  ScreenshareHelperItemPosition,
  ScreenshareHelperButton,
  UserCameraHelperButton,
  UserCameraHelperItemPosition,
  IntlLocaleUiDataNames,
} from 'bigbluebutton-html-plugin-sdk';
import {
  PopoutPluginProps,
  VideoStreamsSubscriptionResultType,
  ScreenshareStreamsSubscriptionResultType,
  AmIBotGraphqlResponse,
} from './types';
import { VIDEO_STREAMS_SUBSCRIPTION, SCREENSHARE_STREAM_SUBSCRIPTION, AM_I_BOT_SUBSCRIPTION } from '../queries';
import { togglePopout } from './service';

const localesContext = require.context('@locales', true, /\.json$/);

const intlMessages = defineMessages({
  label: {
    id: 'app.popoutButton.label',
    description: 'Popout button label',
  },
});

function MediaPopoutPlugin({ pluginUuid: uuid }: PopoutPluginProps):
  React.ReactElement<PopoutPluginProps> {
  BbbPluginSdk.initialize(uuid);
  const pluginApi: PluginApi = BbbPluginSdk.getPluginApi(uuid);

  const currentLocale = pluginApi.useUiData(IntlLocaleUiDataNames.CURRENT_LOCALE, {
    locale: 'en',
    fallbackLocale: 'en',
  });

  let messages = [];
  try {
    messages = localesContext(`./${currentLocale.locale}.json`);
  } catch {
    messages = localesContext(`./${currentLocale.fallbackLocale}.json`);
  }

  const intl = createIntl({
    locale: currentLocale.locale,
    messages,
    fallbackOnEmptyString: true,
  });

  type PoppedMapping = {
    [streamId: string]: WindowProxy | null;
  };

  const [poppedStreams, setPoppedStreams] = React.useState<PoppedMapping>({});
  const [poppedStreamsCount, setPoppedStreamsCount] = React.useState<number>(0);
  const [screensharePopout, setScreensharePopout] = React.useState<WindowProxy | null>(null);

  const { data: videoStreams } = pluginApi.useCustomSubscription<
    VideoStreamsSubscriptionResultType
  >(VIDEO_STREAMS_SUBSCRIPTION);

  const { data: screenshareStreams } = pluginApi.useCustomSubscription<
    ScreenshareStreamsSubscriptionResultType
  >(SCREENSHARE_STREAM_SUBSCRIPTION);

  const { data: amIBotData } = pluginApi.useCustomSubscription<
    AmIBotGraphqlResponse
  >(AM_I_BOT_SUBSCRIPTION);

  useEffect(() => {
    const screenShareStreamId = screenshareStreams?.screenshare[0]?.stream;
    if (!screenShareStreamId && screensharePopout) {
      screensharePopout.close();
      setScreensharePopout(null);
    }
    if (!screensharePopout && screenShareStreamId) {
      const popoutButton = new ScreenshareHelperButton({
        icon: 'popout_window',
        disabled: false,
        label: intl.formatMessage(intlMessages.label),
        tooltip: intl.formatMessage(intlMessages.label),
        position: ScreenshareHelperItemPosition.TOP_RIGHT,
        onClick: ({ browserClickEvent }) => {
          const { parentNode } = browserClickEvent.target as HTMLElement;
          const webcamItem = parentNode.parentNode.parentNode.parentNode as HTMLDivElement;
          const newPopout = togglePopout(webcamItem, screenShareStreamId, 'Screenshare');
          setScreensharePopout(newPopout);
          if (newPopout) {
            newPopout?.addEventListener('beforeunload', () => {
              setScreensharePopout(null);
            });
          }
        },
        hasSeparator: false,
      });
      pluginApi.setScreenshareHelperItems([popoutButton]);
    } else {
      pluginApi.setScreenshareHelperItems([]);
    }
  }, [screensharePopout, screenshareStreams, currentLocale]);

  useEffect(() => {
    // check for removed streams that were popped
    Object.keys(poppedStreams).forEach((streamId) => {
      const found = videoStreams.user_camera.find((uc) => uc.streamId === streamId);
      if (!found) {
        poppedStreams[streamId].close();
        delete poppedStreams[streamId];
        setPoppedStreams(poppedStreams);
        setPoppedStreamsCount(poppedStreamsCount - 1);
      }
    });
  }, [videoStreams]);

  const onClickPopoutButton = (params: {
    userId: string,
    streamId: string,
    browserClickEvent: React.MouseEvent<HTMLButtonElement>
  }) => {
    const { streamId, browserClickEvent } = params;

    const { parentNode } = browserClickEvent.target as HTMLElement;
    const webcamItem = parentNode.parentNode.parentNode.parentNode as HTMLDivElement;
    const userName = videoStreams.user_camera.find((uc) => uc.streamId === streamId)?.user?.name;
    const newPopout = togglePopout(webcamItem, streamId, userName);
    poppedStreams[streamId] = newPopout;

    setPoppedStreams(poppedStreams);
    setPoppedStreamsCount(poppedStreamsCount + 1);

    if (newPopout) {
      newPopout?.addEventListener('beforeunload', () => {
        delete poppedStreams[streamId];
        setPoppedStreams(poppedStreams);
        setPoppedStreamsCount(poppedStreamsCount - 1);
      });
    }
  };

  useEffect(() => {
    if (videoStreams && videoStreams?.user_camera.length > 0) {
      pluginApi.setUserCameraHelperItems([
        new UserCameraHelperButton({
          icon: 'popout_window',
          disabled: false,
          label: intl.formatMessage(intlMessages.label),
          tooltip: intl.formatMessage(intlMessages.label),
          position: UserCameraHelperItemPosition.TOP_RIGHT,
          onClick: onClickPopoutButton,
          displayFunction: ({ streamId }: { streamId: string }) => !amIBotData?.user_current[0]?.bot
            && streamId !== null
            && !poppedStreams[streamId],
        }),
      ]);
    }
  }, [videoStreams, poppedStreamsCount, currentLocale, amIBotData]);

  return null;
}

export default MediaPopoutPlugin;
