import { useTranslation } from 'react-i18next';
import { ModalButton } from 'src/components/ModalButton';
import { MTextField } from 'src/components/MTextField';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useEffect } from 'react';
import { Zendesk } from 'src/services/Zendesk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Container, Title } from './style';
import './style.css';

// Initialize the S3 client
const s3Client = new S3Client({
  region: 'us-east-1', // Replace with your region
  credentials: {
    accessKeyId: 'AKIAUUHKET24PXL4GWRC', // Replace with your access key id
    secretAccessKey: 'YnyMHsS28xRQBFjHsBskN0AN4iL6lgZxsoaDzAx1', // Replace with your secret access key
  },
});

const zaf = new Zendesk();
const base64TokenSunco =
  'YXBwXzYyYjYxNDAxOWI4YjY1MDBlZmQwMDQ4YTpZTWpyR3dzZXRHUlJ2REpYQ0xzLV9vckNGWmJ1WjRCVEtDRlRMZWVIbmNmUWlUNWVrLThwTXpNRlg1dDVoVW81RnpQSUZBV3UzamRuMjF6SVZrOUtoUQ==';
const base64TokenZendesk =
  'bG1hY2Vkb0Bha3RpZW5vdy5jb20vdG9rZW46QUthRGkwNnlHRGxNTVNraFpGUlpuSWhXSUROMktGVE9FM1AwdGl0Zw=='; // instância do Pedro
// 'bG1hY2Vkb0Bha3RpZW5vdy5jb20vdG9rZW46czlLc0pjZmVGa2N6b2NzclZPVzFHTzg4QkJSelZSYmM3VEVMVXkxdA=='; // token para o partnersdev2
const appId = '627ab6eee1645f00f5ab6378';

function Sidebar(): JSX.Element {
  const { t } = useTranslation();
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      blobPropertyBag: { type: 'audio/ogg' },
    });

  const attachToZendesk = async () => {
    if (!mediaBlobUrl) {
      return;
    }

    const currentTicket = await zaf.getTicketInfo();
    console.log(
      'Capabilities of the current ticket',
      zaf.client.get('ticket.editor.capabilities'),
    );

    const responseAudioBlob = await fetch(mediaBlobUrl)
      .then(response => response)
      .then(blob => {
        return blob;
      });
    console.log('responseAudioBlob', responseAudioBlob);
    const contentType =
      responseAudioBlob.headers.get('content-type') || 'application/binary';
    const cAudioBlob = await responseAudioBlob.blob();
    const base64Token =
      'bG1hY2Vkb0Bha3RpZW5vdy5jb20vdG9rZW46QUthRGkwNnlHRGxNTVNraFpGUlpuSWhXSUROMktGVE9FM1AwdGl0Zw=='; // instância do Pedro
    // 'bG1hY2Vkb0Bha3RpZW5vdy5jb20vdG9rZW46czlLc0pjZmVGa2N6b2NzclZPVzFHTzg4QkJSelZSYmM3VEVMVXkxdA=='; // token para o partnersdev2

    const responseToken = await fetch(
      `https://d3vscaktienow1651697330.zendesk.com/api/v2/uploads?filename=test.mp3`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${base64Token}`,
          'Content-Type': contentType,
        },
        body: cAudioBlob,
      },
    );
    const responseTokenJson = await responseToken.json();

    const data = {
      ticket: {
        comment: {
          public: true,
          body: 'novo audio',
          uploads: [responseTokenJson.upload.token],
        },
      },
    };

    zaf
      .request({
        url: `/api/v2/tickets/${currentTicket.id}`,
        type: 'PUT',
        options: {
          data,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.error('error', error);
      });
  };

  const attachToZendeskAndSunco = async () => {
    if (!mediaBlobUrl) {
      return;
    }

    const extractId = (text: string) => {
      const parts = text.split('_');
      return parts[parts.length - 1];
    };

    const ticketTags = await zaf.client.get('ticket.tags');
    console.log('ticketTags', ticketTags);
    const firstMatchingString = ticketTags['ticket.tags'].find((item: any) => {
      return item.includes('droz_conversation');
    });
    const extractedId = firstMatchingString
      ? extractId(firstMatchingString)
      : null;
    console.log('extractedId', extractedId);
    if (!extractedId) {
      return;
    }

    const currentTicket = await zaf.getTicketInfo();

    const responseAudioBlob = await fetch(mediaBlobUrl)
      .then(response => response)
      .then(blob => {
        return blob;
      });
    console.log('responseAudioBlob', responseAudioBlob);
    const contentType =
      responseAudioBlob.headers.get('content-type') || 'application/binary';
    const cAudioBlob = await responseAudioBlob.blob();

    const formData = new FormData();
    formData.append('source', cAudioBlob);

    const accessLevel = 'public'; // or 'private'
    const forParam = 'message';
    const conversationId = extractedId; // replace with actual conversation ID

    const queryParams = new URLSearchParams({
      access: accessLevel,
      for: forParam,
      conversationId,
    }).toString();

    /* const responseUrl = await fetch(
      `https://api.smooch.io/v2/apps/${appId}/attachments?${queryParams}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${base64TokenSunco}`,
        },
        body: formData,
      },
    );
    const responseUrlJson = await responseUrl.json(); */

    const uploadFileAndGetUrl = async (
      fileContent: any,
      bucketName: any,
      key: any,
    ) => {
      try {
        const expirationDate = new Date();
        const extraMinutes = 10;
        expirationDate.setMinutes(expirationDate.getMinutes() + extraMinutes);

        const uploadParams = {
          Bucket: bucketName,
          Key: key,
          Body: fileContent,
          Expires: expirationDate,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        // Construct the file URL
        const fileUrl = `https://${bucketName}.s3.us-east-1.amazonaws.com/${encodeURIComponent(
          key,
        )}`;

        console.log('File uploaded successfully. URL:', fileUrl);
        return fileUrl;
      } catch (error) {
        console.error('Error uploading file:', error);
        return null;
      }
    };

    const bucketName = 'audio-recorder-demo';
    const now = new Date().getTime();
    const key = `${now}-audio.ogg`;

    const retS3Url = await uploadFileAndGetUrl(cAudioBlob, bucketName, key);
    console.log('retS3Url', retS3Url);

    const dataMsgSunco = {
      author: {
        type: 'business',
      },
      content: {
        type: 'file',
        mediaUrl: retS3Url,
        altText: key,
      },
    };
    /* const responseMsgSunco = await fetch(
      `https://api.smooch.io/v2/apps/${appId}/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${base64TokenSunco}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataMsgSunco),
      },
    ).then(response => response.json()); */

    const responseMsgSunco = await zaf.request({
      url: `https://api.smooch.io/v2/apps/${appId}/conversations/${conversationId}/messages`,
      type: 'POST',
      options: {
        data: dataMsgSunco,
        headers: {
          Authorization: `Basic ${base64TokenSunco}`,
          'Content-Type': 'application/json',
        },
      },
    });

    console.log('responseMsgSunco == ', responseMsgSunco);

    const responseToken = await fetch(
      `https://d3vscaktienow1651697330.zendesk.com/api/v2/uploads?filename=${key}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${base64TokenZendesk}`,
          'Content-Type': contentType,
        },
        body: cAudioBlob,
      },
    );
    const responseTokenJson = await responseToken.json();

    const data = {
      ticket: {
        comment: {
          public: true,
          body: 'novo audio',
          uploads: [responseTokenJson.upload.token],
        },
      },
    };

    zaf
      .request({
        url: `/api/v2/tickets/${currentTicket.id}`,
        type: 'PUT',
        options: {
          data,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.error('error', error);
      });
  };

  useEffect(() => {
    console.log('mediaBlobUrl', mediaBlobUrl);
  }, [mediaBlobUrl]);

  useEffect(() => {
    zaf.resize(700, 400);
  }, []);

  return (
    <Container>
      <p>{status}</p>
      <button className="btn" type="button" onClick={startRecording}>
        Iniciar Gravação
      </button>
      <button className="btn" type="button" onClick={stopRecording}>
        Parar Gravação
      </button>
      <div className="audio-player">
        <audio src={mediaBlobUrl} controls autoPlay>
          <track kind="captions" />
        </audio>
      </div>

      <div className="attachment">
        <button
          className="btn"
          id="attach"
          type="button"
          onClick={attachToZendeskAndSunco}
        >
          Adicionar comentário
        </button>
      </div>
    </Container>
  );
}

export default Sidebar;
