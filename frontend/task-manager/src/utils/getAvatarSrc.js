import { BASE_URL } from "../utils/apiPaths";
import placeholderImg from "../../public/my.jpg";

export default function getAvatarSrc(user) {
    if (!user) return placeholderImg;

    let raw = user.profileImageUrl || user.profileImage || "";
    const isAbsolute = /^https?:\/\//i.test(raw);

    if (raw && !isAbsolute) {
        const base = BASE_URL.replace(/\/$/, "");
        raw = raw.startsWith("/") ? `${base}${raw}` : `${base}/${raw}`;
    }

    return (
        raw ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`
    );
}
