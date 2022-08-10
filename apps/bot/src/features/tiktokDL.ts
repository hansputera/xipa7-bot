import phin from 'phin';

// ref: https://github.com/hansputera/tiktok-dl/blob/dev/packages/core/src/base.ts#L4
export interface TTData {
  error?: string;
  video?: {
    id?: string;
    thumb?: string;
    urls: string[];
    title?: string;
    duration?: string;
  };
  music?: {
    url: string;
    title?: string;
    author?: string;
    id?: string;
    cover?: string;
    album?: string;
    duration?: number;
  };
  author?: {
    username?: string;
    thumb?: string;
    id?: string;
    nick?: string;
  };
  caption?: string;
  playsCount?: number;
  sharesCount?: number;
  commentsCount?: number;
  likesCount?: number;
  uploadedAt?: string;
  updatedAt?: string;
}

const handleUrl = async (url: string): Promise<TTData | undefined> => {
  const resp = await phin({
    'method': 'POST',
    'url': 'https://tdl.besecure.eu.org/api/download',
    'data': {
      'url': url,
      'type': 'ttdownloaderone',
    },
  });

  if (resp.statusCode !== 200) {
    return undefined;
  } else {
    const data = JSON.parse(resp.body.toString()) as TTData;
    if (data.error) return undefined;
    else return data;
  }
};

export const downloadTiktok = async (urls: string[]) => {
  return await Promise.all(urls.map(handleUrl));
};
