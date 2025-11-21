import { useRouter } from "next/router";
import { useEffect,useState } from "react";

export const useHandleBack = ():(() => void) => {
    const router = useRouter();
    const [isBack, setIsBack] = useState<boolean>(false);

    useEffect(() => {
        const isSameDomain = document.referrer && new URL(document.referrer).hostname === window.location.hostname;
        setIsBack(!isSameDomain);
        
        },[]);

        // restart in case of error

    console.log('isDomain',isBack)
    const handleBack = (): void => {
        if (document.referrer) {
            // console.log("back is",router.back())
            // console.log("back is",isBack)
            router.back();
            console.log("path is",router.pathname)
            

         
        } else {
            console.log("home")
            router.push("/");
        }
    }

    return handleBack;
}