import pages from '@/router/pages.ts'
import { useRouter } from 'vue-router'
import useAuthentication from '@/stores/Authentication.ts'

const useRedirect = ()=>{

  const route = useRouter();
  const userInfo = useAuthentication().userInfo;

  const handleRedirect = async ()=>{
    const role = userInfo.role;
    if (role === 'ADMIN' || role === 'TEACHER') {
      await redirectAdmin()
    } else {
      await redirectUser()
    }
  }

  const redirectAdmin = async () => {
    await route.push(pages.dashboard);
  }

  const redirectUser = async () => {
    await route.push(pages.home);
  }

  const redirectCourse = async () => {
    await route.push(pages.course);
  }

  return {handleRedirect,redirectCourse};
};

export default useRedirect;