import * as Apps from 'src/apps';
import NotFound from 'src/pages/Errors/NotFound';
import { appSidebar, appNavbar, appModal } from 'src/utils/constants/app';

function Page(): JSX.Element {
  const urlParams = new URLSearchParams(window.location.search);
  const destinationApp = urlParams.get('type') || urlParams.get('modal');

  if (destinationApp === appSidebar) return <Apps.SideBar />;
  if (destinationApp === appNavbar) return <Apps.NavBar />;
  if (destinationApp === appModal) return <Apps.Modal />;

  return <NotFound />;
}

export default Page;
