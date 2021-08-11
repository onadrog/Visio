import React, { lazy, useCallback, useState } from 'react'
import { useGetuserList, useToggle } from '../hooks'
import { connect } from 'react-redux'
import { onlineUserSelector, OfflineUserSelector, inRoomUserSelector, currentUserSelector } from '../redux/userSelector';
import { useJoinRoom } from '../hooks'
import { peerCall } from '../peerHooks';
const List = lazy(() => import('@material-ui/core/List'))
const AddIcCallIcon = lazy(() => import('@material-ui/icons/AddIcCall'))
const Avatar = lazy(() => import('@material-ui/core/Avatar'))
const ListItem = lazy(() => import('@material-ui/core/ListItem'))
const Chip = lazy(() => import('@material-ui/core/Chip'))
const ListSubheader = lazy(() => import('@material-ui/core/ListSubheader'))
const Drawer = lazy(() => import('@material-ui/core/Drawer'))
const Hidden = lazy(() => import('@material-ui/core/Hidden'))
const IconButton = lazy(() => import('@material-ui/core/IconButton'))
const PeopleAltIcon = lazy(() => import('@material-ui/icons/PeopleAlt'))

const Sidebar = ({ offlineUsers, onlineUsers, inRoomUsers, clientUser }) => {

    useGetuserList('/api/users')

    const [mobileOpen, setMobileOpen] = useState(false);
    const [visible, toggle] = useToggle()

    /**
     * On mobile expand drawer
     */
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    /**
     * Join Room and call user if someone is already in
     */
    const handleJoinRoom = useCallback((e) => {
        e.preventDefault()
        mobileOpen ? handleDrawerToggle() : null
        toggle()
        useJoinRoom(JSON.stringify(clientUser[0]))
        if (inRoomUsers.length > 0) {
            const targetId = inRoomUsers.map(u => u.peerId)
            targetId.map(t => peerCall(t))
        }
    })

    /**
     * Toggle joinRoom btn to visible when user quit the room
     */
    clientUser[0] && !clientUser[0].inRoom && visible ? toggle(): null

    /**
     * Map users in 3 lists 'Online' | 'Offline' | 'inRoom'
     */
    const list = (
        <>
            <List subheader={<ListSubheader>Join Room <IconButton disabled={visible} onClick={handleJoinRoom}><AddIcCallIcon fontSize='small' /></IconButton></ListSubheader>}>
                {inRoomUsers.map(u => (
                    <ListItem key={u.id}>
                        <Chip
                            label={u.username}
                            avatar={<Avatar>{u.username.charAt(0).toUpperCase()}</Avatar>}
                            color="secondary"
                            peerid={u.peerId}
                            usrid={u.id}
                        />
                    </ListItem>
                ))}
            </List>
            <br />
            <List subheader={<ListSubheader>Online</ListSubheader>}>
                {onlineUsers.map(u => (
                    <ListItem key={u.id}>
                        <Chip
                            label={u.username}
                            avatar={<Avatar>{u.username.charAt(0).toUpperCase()}</Avatar>}
                            color="primary"
                            peerid={u.peerId}
                            usrid={u.id}
                        />
                    </ListItem>)
                )}
            </List>
            <br />
            <List subheader={<ListSubheader>Offline</ListSubheader>}>
                {offlineUsers.map(u => (
                    <ListItem key={u.id}>
                        <Chip
                            label={u.username}
                            disabled
                            avatar={<Avatar>{u.username.charAt(0).toUpperCase()}</Avatar>}
                            variant="outlined"
                            color="default" />
                    </ListItem>
                ))}
            </List>
        </>
    )

    return <>
        <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
        >
            <PeopleAltIcon />
        </IconButton>
        <Hidden smUp implementation="css">
            <Drawer
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                anchor='left'>
                {list}
            </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
            <Drawer
                variant="permanent"
                open
                anchor='left'>
                {list}
            </Drawer>
        </Hidden>
    </>
}

const SidebarStore = connect(
    (state) => ({
        offlineUsers: OfflineUserSelector(state),
        onlineUsers: onlineUserSelector(state),
        inRoomUsers: inRoomUserSelector(state),
        clientUser: currentUserSelector(state)
    })
)(Sidebar)
export default SidebarStore