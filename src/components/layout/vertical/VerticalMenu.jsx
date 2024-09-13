// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'
// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'
// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'
// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'
const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)
const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar
  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <MenuItem href='/main' icon={<i className='ri-home-smile-line' />}>
          Dashboard
        </MenuItem>
        {/* <MenuItem href='/' icon={<i className='ri-home-smile-line' />}> */}
        <SubMenu label='Itinerary ' icon={<i className='ri-file-copy-line' />}>
          <MenuItem href={`/add-Itinerary`}>Manage Itinerary</MenuItem>
          <MenuItem href={`/all-itinearary`}>All Itinerary</MenuItem>
          <MenuItem href={`/categories`}>Type of Activity </MenuItem>
          {/* <MenuItem href={`/categories`}>Categories</MenuItem> */}
        </SubMenu>
        <SubMenu label='Accommodations ' icon={<i className='ri-file-copy-line' />}>
          <MenuItem href={`/add-accommodation`}>Manage Accommodation</MenuItem>
          <MenuItem href={`/all-accommodation`}>All Accommodation</MenuItem>
          <MenuItem href={`/accommodation-types`}>Create Accommodation Types</MenuItem>
          {/* <MenuItem href={`/categories`}>Categories</MenuItem> */}
        </SubMenu>
        <MenuItem href='/main-page' icon={<i className='ri-home-smile-line' />}>
          Home
        </MenuItem>
        <MenuItem href='/places-to-visit' icon={<i className='ri-home-smile-line' />}>
          Place to Visit
        </MenuItem>
        <MenuItem href='/things-to-do' icon={<i className='ri-home-smile-line' />}>
          Things-to-do
        </MenuItem>
        <MenuItem href='/plan-your-trip' icon={<i className='ri-home-smile-line' />}>
          Plan Your Trip
        </MenuItem>

        <MenuItem href='/Accommodation-Desc' icon={<i className='ri-home-smile-line' />}>
          Accommodation
        </MenuItem>
        {/* <MenuItem href='/aboutpage' icon={<i className='ri-home-smile-line' />}>
          About
        </MenuItem> */}
        {/* <MenuSection label='Apps & Pages'>
          <MenuItem href='/account-settings' icon={<i className='ri-user-settings-line' />}>
            Account Settings
          </MenuItem>
        </MenuSection> */}
      </Menu>
    </ScrollWrapper>
  )
}
export default VerticalMenu
