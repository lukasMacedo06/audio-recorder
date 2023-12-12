import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Zendesk } from '../../../services/Zendesk';
import SideBar from '../../../apps/sidebar';

jest.mock('../../../services/Zendesk');
jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

describe('App SideBar renders correctly', () => {
  it('Should render without crashing', () => {
    render(<SideBar />);
    expect(screen.getByTestId('create-importer-exporter')).toBeInTheDocument();
  });

  it('Should fail when the handleCreate function is called withou an importerExporter', async () => {
    const spyZendeskNotify = jest.spyOn(Zendesk.prototype, 'notify');

    render(<SideBar />);

    const createButton = screen.getByTestId('create-importer-exporter');
    fireEvent.click(createButton);

    expect(spyZendeskNotify).toHaveBeenCalledWith(
      'apps.sidebar.errorImporterExporterNotInformed',
      'error',
    );
  });

  it('Should return success when the handleCreate is called with an importerExporter', async () => {
    const spyZendeskNotify = jest.spyOn(Zendesk.prototype, 'notify');
    const spyZendesRequest = jest
      .spyOn(Zendesk.prototype, 'request')
      .mockImplementation(() => new Promise(() => {}));

    render(<SideBar />);

    const fieldImporterExporter = screen.getByTestId('input-importer-exporter');
    fireEvent.input(fieldImporterExporter, {
      target: { value: 'Importador/Exportador' },
    });

    const createButton = screen.getByTestId('create-importer-exporter');
    fireEvent.click(createButton);

    await waitFor(() => createButton);

    expect(spyZendesRequest).toHaveBeenCalled();
    expect(spyZendeskNotify).toHaveBeenCalledWith(
      'apps.sidebar.successCreateImporterExporter',
      'success',
    );
  });
});
