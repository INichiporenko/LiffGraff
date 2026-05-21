import home from "../../assets/nav_icons/home/home.svg"
import homeFill from "../../assets/nav_icons/home/home_fill.svg"
import search from "../../assets/nav_icons/search/search.svg"
import searchFill from "../../assets/nav_icons/search/search_fill.svg"
import explore from "../../assets/nav_icons/explore/explore.svg"
import exploreFill from "../../assets/nav_icons/explore/explore_fill.svg"
import messages from "../../assets/nav_icons/messages/messages.svg"
import messagesFill from "../../assets/nav_icons/messages/messages_fill.svg"
import notifications from "../../assets/nav_icons/notifications/notifications.svg"
import notificationsFill from "../../assets/nav_icons/notifications/notifications_fill.png"
import create from "../../assets/nav_icons/create/create.svg"
import createFill from "../../assets/nav_icons/create/create_fill.svg"


type Link = {
    name: string;
    href: string;
    logo: string
    logoFill: string
}

const links: Link[] = [{
    name: 'Home',
    href: '/',
    logo: home,
    logoFill: homeFill
}, {
    name: 'Search',
    href: '/search',
    logo: search,
    logoFill: searchFill
}, {
    name: 'Explore',
    href: '/explore',
    logo: explore,
    logoFill: exploreFill
}, {
    name: 'Messages',
    href: '/messages',
    logo: messages,
    logoFill: messagesFill
}, {
    name: 'Notifications',
    href: '/notifications',
    logo: notifications,
    logoFill: notificationsFill
}, {
    name: 'Create',
    href: '/create',
    logo: create,
    logoFill: createFill
}];

export default links;