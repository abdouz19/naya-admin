import type { ComponentType, SVGAttributes } from 'react';
import {
  Activity as IxActivity,
  Add as IxAdd,
  ArrowDown2 as IxArrowDown2,
  ArrowLeft as IxArrowLeft,
  ArrowRight as IxArrowRight,
  ArrowSwapVertical as IxArrowSwapVertical,
  Book1 as IxBook1,
  Briefcase as IxBriefcase,
  Calendar as IxCalendar,
  CalendarTick as IxCalendarTick,
  Card as IxCard,
  Category2 as IxCategory2,
  ClipboardTick as IxClipboardTick,
  Clock as IxClock,
  CloseCircle as IxCloseCircle,
  DirectInbox as IxDirectInbox,
  DocumentDownload as IxDocumentDownload,
  DocumentText as IxDocumentText,
  DollarCircle as IxDollarCircle,
  Edit2 as IxEdit2,
  ExportSquare as IxExportSquare,
  Eye as IxEye,
  EyeSlash as IxEyeSlash,
  Filter as IxFilter,
  Flag as IxFlag,
  Global as IxGlobal,
  Heart as IxHeart,
  HeartTick as IxHeartTick,
  InfoCircle as IxInfoCircle,
  LampCharge as IxLampCharge,
  Link as IxLink,
  Link2 as IxLink2,
  Lock as IxLock,
  LogoutCurve as IxLogoutCurve,
  MagicStar as IxMagicStar,
  Message as IxMessage,
  MessageQuestion as IxMessageQuestion,
  MessageText as IxMessageText,
  Messages as IxMessages,
  MoneyRecive as IxMoneyRecive,
  People as IxPeople,
  Play as IxPlay,
  PlayCircle as IxPlayCircle,
  Refresh as IxRefresh,
  Refresh2 as IxRefresh2,
  RotateLeft as IxRotateLeft,
  SearchNormal1 as IxSearchNormal1,
  Send2 as IxSend2,
  Setting2 as IxSetting2,
  Shield as IxShield,
  ShieldCross as IxShieldCross,
  ShieldTick as IxShieldTick,
  Sms as IxSms,
  TickCircle as IxTickCircle,
  Trash as IxTrash,
  TrendDown as IxTrendDown,
  TrendUp as IxTrendUp,
  User as IxUser,
  UserAdd as IxUserAdd,
  UserMinus as IxUserMinus,
  UserRemove as IxUserRemove,
  UserTick as IxUserTick,
  Video as IxVideo,
  VideoSquare as IxVideoSquare,
  Warning2 as IxWarning2,
  type Icon as IconsaxIcon,
} from 'iconsax-react';

/**
 * Icons of the admin, drawn with Iconsax like the NAYHA mobile app. The
 * names are the ones the screens already use; a thicker stroke (the active
 * state) switches to Iconsax's Bold variant.
 */
export interface IconProps extends Omit<SVGAttributes<SVGElement>, 'color'> {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}

export type LucideIcon = ComponentType<IconProps>;

function iconsax(Base: IconsaxIcon): LucideIcon {
  function AdminIcon({
    size = 24,
    color = 'currentColor',
    strokeWidth,
    ...rest
  }: IconProps) {
    const bold = Number(strokeWidth) >= 2.2;
    return (
      <Base size={size} color={color} variant={bold ? 'Bold' : 'Linear'} {...rest} />
    );
  }
  return AdminIcon;
}

export const Activity = iconsax(IxActivity);
export const AlertCircle = iconsax(IxInfoCircle);
export const ArrowLeft = iconsax(IxArrowLeft);
export const ArrowRight = iconsax(IxArrowRight);
export const ArrowUpDown = iconsax(IxArrowSwapVertical);
export const BookOpen = iconsax(IxBook1);
export const Brain = iconsax(IxLampCharge);
export const Briefcase = iconsax(IxBriefcase);
export const CalendarCheck = iconsax(IxCalendarTick);
export const CalendarDays = iconsax(IxCalendar);
export const Check = iconsax(IxTickCircle);
export const CheckCircle2 = iconsax(IxTickCircle);
export const ChevronDown = iconsax(IxArrowDown2);
export const ClipboardCheck = iconsax(IxClipboardTick);
export const Clock = iconsax(IxClock);
export const CreditCard = iconsax(IxCard);
export const DollarSign = iconsax(IxDollarCircle);
export const Download = iconsax(IxDocumentDownload);
export const Edit2 = iconsax(IxEdit2);
export const Euro = iconsax(IxMoneyRecive);
export const ExternalLink = iconsax(IxExportSquare);
export const Eye = iconsax(IxEye);
export const EyeOff = iconsax(IxEyeSlash);
export const FileText = iconsax(IxDocumentText);
export const Film = iconsax(IxVideoSquare);
export const Filter = iconsax(IxFilter);
export const Flag = iconsax(IxFlag);
export const Globe = iconsax(IxGlobal);
export const Heart = iconsax(IxHeart);
export const HeartHandshake = iconsax(IxHeartTick);
export const Inbox = iconsax(IxDirectInbox);
export const LayoutDashboard = iconsax(IxCategory2);
export const LifeBuoy = iconsax(IxMessageQuestion);
export const Link2 = iconsax(IxLink2);
export const LinkIcon = iconsax(IxLink);
export const Lock = iconsax(IxLock);
export const LogOut = iconsax(IxLogoutCurve);
export const Mail = iconsax(IxSms);
export const MessageCircle = iconsax(IxMessage);
export const MessageSquare = iconsax(IxMessageText);
export const MessagesSquare = iconsax(IxMessages);
export const Pencil = iconsax(IxEdit2);
export const Play = iconsax(IxPlay);
export const PlayCircle = iconsax(IxPlayCircle);
export const Plus = iconsax(IxAdd);
export const RefreshCcw = iconsax(IxRefresh);
export const RefreshCw = iconsax(IxRefresh2);
export const RotateCcw = iconsax(IxRotateLeft);
export const Search = iconsax(IxSearchNormal1);
export const Send = iconsax(IxSend2);
export const Settings = iconsax(IxSetting2);
export const Shield = iconsax(IxShield);
export const ShieldBan = iconsax(IxShieldCross);
export const ShieldCheck = iconsax(IxShieldTick);
export const Sparkles = iconsax(IxMagicStar);
export const Trash2 = iconsax(IxTrash);
export const TrendingDown = iconsax(IxTrendDown);
export const TrendingUp = iconsax(IxTrendUp);
export const TriangleAlert = iconsax(IxWarning2);
export const User = iconsax(IxUser);
export const UserCheck = iconsax(IxUserTick);
export const UserMinus = iconsax(IxUserMinus);
export const UserPlus = iconsax(IxUserAdd);
export const UserX = iconsax(IxUserRemove);
export const Users = iconsax(IxPeople);
export const Video = iconsax(IxVideo);
export const X = iconsax(IxCloseCircle);
export const XIcon = iconsax(IxCloseCircle);
