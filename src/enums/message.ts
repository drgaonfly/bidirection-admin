import { useIntl } from '@umijs/max';

const MessageType = () => {
  const intl = useIntl();

  return {
    TEXT: { text: intl.formatMessage({ id: 'text' }), value: 'text' },
    PHOTO: { text: intl.formatMessage({ id: 'photo' }), value: 'photo' },
    VIDEO: { text: intl.formatMessage({ id: 'video' }), value: 'video' },
    VOICE: { text: intl.formatMessage({ id: 'voice' }), value: 'voice' },
    DOCUMENT: { text: intl.formatMessage({ id: 'document' }), value: 'document' },
    STICKER: { text: intl.formatMessage({ id: 'sticker' }), value: 'sticker' },
    LOCATION: { text: intl.formatMessage({ id: 'location' }), value: 'location' },
    MENTION: { text: intl.formatMessage({ id: 'mention' }), value: 'mention' },
    COMMAND: { text: intl.formatMessage({ id: 'command' }), value: 'command' },
    AUDIO: { text: intl.formatMessage({ id: 'audio' }), value: 'audio' },
    FILE: { text: intl.formatMessage({ id: 'file' }), value: 'file' },
    OTHER: { text: intl.formatMessage({ id: 'other' }), value: 'other' },
    UNKNOWN: { text: intl.formatMessage({ id: 'unknown' }), value: 'unknown' },
  };
};

export default MessageType;
