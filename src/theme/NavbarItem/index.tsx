import React, {type ReactNode} from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import type NavbarItemType from '@theme/NavbarItem';
import type {WrapperProps} from '@docusaurus/types';
import NotificationBell from '../../components/NotificationBell';
import { getNotifications, detectLanguage } from '../../data/notifications';

type Props = WrapperProps<typeof NavbarItemType> & {
  type?: string;
  notifications?: any[];
};

export default function NavbarItemWrapper(props: Props): ReactNode {
  if (props.type === 'custom-NotificationBell') {
    // Get language-specific notifications.
    const currentLanguage = detectLanguage();
    const notifications = getNotifications(currentLanguage);

    return <NotificationBell notifications={notifications} />;
  }
  return <NavbarItem {...props} />;
}
