import React from 'react';
import { faComment, faHome, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { auth } from '../../../firebase';
import s from './MobileNavbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Avatar from '../../avatar/Avatar';
import { Link } from 'react-router-dom';
import CreatePost from '../../createPost/CreatePost';
import {faStore, faBatteryCar } from '@fortawesome/free-solid-svg-icons';

const pages = [
  {
    link: '/',
    icon: faHome,
    title: 'Home',
  },
  {
    link: '/messenger',
    icon: faComment,
    title: 'Messenger',
  },
    {
    link: `/users/${auth.currentUser?.uid}`,
    icon: faUser,
    title: 'Profile',
  },
  {
    link: '/marketplace',
    icon: faStore,
    title: 'Marketplace',
  },
  {
    link: '/talleres',
    icon: faBatteryCar,
    title: 'Talleres',
  },



];

const MobileNavbar = () => {
  const [createPostMode, setCreatePostMode] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
    }
  }, [auth.currentUser]);

  return (
    <>
      {userId && (
        <div className={s.root}>
          {createPostMode && <CreatePost setCreatePostMode={setCreatePostMode} />}
          {pages.map((page) => {
            return (
              <React.Fragment key={page.title}>
                {page.title.toLowerCase() === 'profile' ? (
                  <Link to={`/users/${auth.currentUser?.uid}`} className={s.page}>
                    <div className={s.avatar}>
                      <Avatar id={auth.currentUser?.uid} />
                    </div>
                  </Link>
                ) : (
                  <Link to={page.link} className={s.page}>
                    <FontAwesomeIcon icon={page.icon} />
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
