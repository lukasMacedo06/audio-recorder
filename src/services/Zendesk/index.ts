import { SettingsProps } from 'src/interfaces/settings';
import ZAFClient from 'zendesk_app_framework_sdk';

interface RequestProps {
  url: string;
  type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  options: RequestOptions;
}

interface RequestOptions {
  data?: any;
  dataType?: string;
  headers?: any;
  secure?: boolean;
  contentType?: string;
  cors?: boolean;
}

interface RequestZendesk {
  url: string;
  type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  dataType?: string;
  headers?: any;
  secure?: boolean;
  contentType?: string;
  cors?: boolean;
}

const MODAL_URL =
  process.env.REACT_APP_NODE_ENV === 'development'
    ? process.env.REACT_APP_DEV_MODAL_URL
    : process.env.REACT_APP_PRD_MODAL_URL;

export class Zendesk {
  public client: any;

  private defaultHeader: any = { 'Content-Type': 'application/json' };

  constructor() {
    this.client = ZAFClient.init();

    if (!this.client) throw new Error('Client not initialized!');
  }

  request({ url, type, options }: RequestProps): Promise<any> {
    const { headers, data } = options;

    let requestZendesk: RequestZendesk = {
      url,
      type,
      headers: !headers
        ? { ...this.defaultHeader, ...headers }
        : this.defaultHeader,
    };

    if (options) requestZendesk = { ...requestZendesk, ...options };

    if (data) {
      requestZendesk.data = data;

      if (requestZendesk.headers['Content-Type'].includes('json')) {
        requestZendesk.data = JSON.stringify(data);
      }
    }

    return this.client.request(requestZendesk);
  }

  getInstances(location: string, trigger: string, obj?: object) {
    return this.client
      .get('instances')
      .then((instancesData: any) => {
        try {
          const instances = instancesData?.instances;
          const appClients = [];
          // eslint-disable-next-line no-restricted-syntax
          for (const instanceGuid in instances) {
            if (instances[instanceGuid].location === location) {
              appClients.push(this.client.instance(instanceGuid));
            }
          }
          return appClients;
        } catch (err) {
          return err;
        }
      })
      .then((appClients: any) => {
        for (const index in appClients) {
          if (index === '0') {
            try {
              appClients[index].trigger(trigger, obj);
            } catch (err) {
              throw new Error('Trigger failed!');
            }
          }
        }
      });
  }

  modal(modalName: string) {
    return this.client
      .invoke('instances.create', {
        location: 'modal',
        url: `${MODAL_URL}?modal=${modalName}`,
        size: {
          width: '900px',
          height: '440px',
        },
      })
      .then((modalContext: any) => {
        return modalContext['instances.create'][0].instanceGuid;
      });
  }

  resize(width: number, height: number): void {
    this.client.invoke('resize', { width, height });
  }

  async getSettings(): Promise<SettingsProps> {
    const { settings } = await this.client.metadata();
    return settings;
  }

  notify(
    description: string,
    type: string | 'notice',
    duration?: number,
    options?: any,
  ): boolean {
    const config = options || duration;
    this.client.invoke('notify', description, type, config);
    return true;
  }

  async getTicketInfo(): Promise<any> {
    return this.client.get('ticket').then((data: any) => {
      return data.ticket;
    });
  }

  async getTicketField(id: string): Promise<string | number | null> {
    const ticketField = await this.client.get(
      `ticket.customField:custom_field_${id}`,
    );
    return ticketField[`ticket.customField:custom_field_${id}`];
  }

  ticketChanged(fieldID: string, callback: (response: any) => void): void {
    return this.client.on(`ticket.custom_field_${fieldID}.changed`, callback);
  }

  async getCurrentUser(): Promise<any> {
    const user = await this.client.get('currentUser');
    return user.currentUser;
  }

  async getTicketRequester(userId: number): Promise<any> {
    return this.client.request(`/api/v2/users/${userId}.json`);
  }

  hideTicketField(id: string): void {
    return this.client.invoke(`ticketFields:custom_field_${id}.hide`);
  }

  disableTicketField(id: string): void {
    return this.client.invoke(`ticketFields:custom_field_${id}.disable`);
  }

  enableTicketField(id: string): void {
    return this.client.invoke(`ticketFields:custom_field_${id}.enable`);
  }

  showTicketField(id: string): void {
    return this.client.invoke(`ticketFields:custom_field_${id}.show`);
  }

  setValueOnTicketField(id: string, value: any): void {
    return this.client.set(`ticket.customField:custom_field_${id}`, value);
  }

  listenEvent(event: string, callback: (response: any) => any): void {
    return this.client.on(event, callback);
  }
}
