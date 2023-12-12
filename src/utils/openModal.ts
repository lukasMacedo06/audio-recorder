import { Zendesk } from 'src/services/Zendesk';

const zend = new Zendesk();

const fetchData = async (instanceId: string, values: any) => {
  zend.client.instance(instanceId).trigger('modalFetchData', {
    values,
    // eslint-disable-next-line no-underscore-dangle
    parent_id: zend.client._instanceGuid,
  });
};

const openModal = (values: any, modalName?: string) => {
  const name = modalName || 'modal';
  // caso seja utilizado um outro nome é necessário atualizar o app.ts dentro de /src/utils/constants
  zend.modal(name).then((instance: string) => {
    zend.client.on('fetchData', function aux() {
      fetchData(instance, values);
      zend.client.off('fetchData', aux);
    });
  });
};

export default openModal;
