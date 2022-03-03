import React, {useState} from 'react'
import './sidebar.scss'
import sidebar_item from './sidebarData'
import { Link} from 'react-router-dom'
import { ChevronLeft } from '@mui/icons-material'
import {ROUTES} from '../../configs/routes' 
interface ListItemProps {
    name: string;
    routeName: string;
}

interface SidebarProps {
    active: string;
    displayName: string;
    router: string;
    icon: React.ReactNode;
    listItem: ListItemProps[];
}

const SidebarItem = (props: any) => {
    const active = props.active ? 'active' : '';
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(!open);
    }

    return (
        <div className="sidebar-item">
            <div className={`sidebar-item__inner ${active}`} onClick={handleOpen}>
                {props.icon}
                <span>
                    {props.name}
                </span>
                {
                    props.listItem ? <span className="icon-right" onClick={handleOpen}><ChevronLeft/></span> : null
                }
            </div>
            {
                open && props.listItem ? (
                    <ul className="sidebar-item__list">
                        {
                            props.name === 'Catalog' ? props.listItem.map((item: any, index: number) => {
                                return (
                                    <Link to={`${ROUTES.product}${item.routeItem}`} key={index}>
                                        <li key={index}>{item.name}</li>
                                    </Link>
                                )
                            }) : props.listItem.map((item: any, index: number) => {
                                return (
                                    <Link to={`${ROUTES.user}${item.routeItem}`} key={index}>
                                        <li key={index}>{item.name}</li>
                                    </Link>
                                )
                            })
                        }
                    </ul>
                ) : null
            }
        </div>
    )
}

export default function Sidebar(props: any) {
    const activeItem = sidebar_item.findIndex(value => value.route === props?.location.pathname);
    // const { isOpen, toggle } = props;

    return (
        <div className='sidebar'>
            <div className='sidebar-container'>
                {
                    sidebar_item.map((item, index) => {
                        return (
                            <div key={index}>
                                <SidebarItem
                                    icon={item.icon}
                                    name={item.displayName}
                                    active={index === activeItem}
                                    listItem={item.listItem}
                                    route={item.route}
                                />
                            </div>
                        )
                    })
                }
            </div>
            
        </div>
    )
}