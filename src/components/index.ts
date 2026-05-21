import MiAvatar from '@/components/basic/Avatar.vue';
import MiButton from '@/components/basic/Button.vue';
import MiAutocomplete from '@/components/controls/Autocomplete.vue';
import MiCheckbox from '@/components/controls/Checkbox.vue';
import MiCheckboxGroup from '@/components/controls/CheckboxGroup.vue';
import MiDatePicker from '@/components/controls/DatePicker.vue';
import MiField from '@/components/controls/Field.vue';
import MiRadio from '@/components/controls/Radio.vue';
import MiRadioGroup from '@/components/controls/RadioGroup.vue';
import MiSelect from '@/components/controls/Select.vue';
import MiSwitch from '@/components/controls/Switch.vue';
import MiTextarea from '@/components/controls/Textarea.vue';
import MiAlert from '@/components/feedback/Alert.vue';
import MiBadge from '@/components/feedback/Badge.vue';
import MiDialog from '@/components/feedback/Dialog.vue';
import MiDrawer from '@/components/feedback/Drawer.vue';
import MiModal from '@/components/feedback/Modal.vue';
import MiNotificationItem from '@/components/feedback/NotificationItem.vue';
import MiNotifications from '@/components/feedback/Notifications.vue';
import MiProgress from '@/components/feedback/Progress.vue';
import MiRating from '@/components/feedback/Rating.vue';
import MiFrame from '@/components/frame/Frame.vue';
import MiPictureFrame from '@/components/frame/PictureFrame.vue';
import MiFieldAccordionList from '@/components/inner-parts/FieldAccordionList.vue';
import MiFieldFrame from '@/components/inner-parts/FieldFrame.vue';
import MiInputTextCounter from '@/components/inner-parts/InputTextCounter.vue';
import MiOpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import MiOpacityTransitionGroup from '@/components/inner-parts/OpacityTransitionGroup.vue';
import MiTranslateTransition from '@/components/inner-parts/TranslateTransition.vue';
import MiTranslateTransitionGroup from '@/components/inner-parts/TranslateTransitionGroup.vue';
import MiBottomNav from '@/components/navigation/BottomNav.vue';
import MiBreadcrumb from '@/components/navigation/Breadcrumb.vue';
import MiPagination from '@/components/navigation/Pagination.vue';
import MiStep from '@/components/navigation/Step.vue';
import MiTab from '@/components/navigation/Tab.vue';

export const componentNameMap = {
    MiAvatar: { name: 'MiAvatar' as const, component: MiAvatar },
    MiButton: { name: 'MiButton' as const, component: MiButton },
    MiAutocomplete: { name: 'MiAutocomplete' as const, component: MiAutocomplete },
    MiCheckbox: { name: 'MiCheckbox' as const, component: MiCheckbox },
    MiCheckboxGroup: { name: 'MiCheckboxGroup' as const, component: MiCheckboxGroup },
    MiDatePicker: { name: 'MiDatePicker' as const, component: MiDatePicker },
    MiField: { name: 'MiField' as const, component: MiField },
    MiRadio: { name: 'MiRadio' as const, component: MiRadio },
    MiRadioGroup: { name: 'MiRadioGroup' as const, component: MiRadioGroup },
    MiSelect: { name: 'MiSelect' as const, component: MiSelect },
    MiSwitch: { name: 'MiSwitch' as const, component: MiSwitch },
    MiTextarea: { name: 'MiTextarea' as const, component: MiTextarea },
    MiAlert: { name: 'MiAlert' as const, component: MiAlert },
    MiBadge: { name: 'MiBadge' as const, component: MiBadge },
    MiDialog: { name: 'MiDialog' as const, component: MiDialog },
    MiDrawer: { name: 'MiDrawer' as const, component: MiDrawer },
    MiModal: { name: 'MiModal' as const, component: MiModal },
    MiNotificationItem: { name: 'MiNotificationItem' as const, component: MiNotificationItem },
    MiNotifications: { name: 'MiNotifications' as const, component: MiNotifications },
    MiProgress: { name: 'MiProgress' as const, component: MiProgress },
    MiRating: { name: 'MiRating' as const, component: MiRating },
    MiFrame: { name: 'MiFrame' as const, component: MiFrame },
    MiPictureFrame: { name: 'MiPictureFrame' as const, component: MiPictureFrame },
    MiFieldAccordionList: { name: 'MiFieldAccordionList' as const, component: MiFieldAccordionList },
    MiFieldFrame: { name: 'MiFieldFrame' as const, component: MiFieldFrame },
    MiInputTextCounter: { name: 'MiInputTextCounter' as const, component: MiInputTextCounter },
    MiOpacityTransition: { name: 'MiOpacityTransition' as const, component: MiOpacityTransition },
    MiOpacityTransitionGroup: { name: 'MiOpacityTransitionGroup' as const, component: MiOpacityTransitionGroup },
    MiTranslateTransition: { name: 'MiTranslateTransition' as const, component: MiTranslateTransition },
    MiTranslateTransitionGroup: { name: 'MiTranslateTransitionGroup' as const, component: MiTranslateTransitionGroup },
    MiBottomNav: { name: 'MiBottomNav' as const, component: MiBottomNav },
    MiBreadcrumb: { name: 'MiBreadcrumb' as const, component: MiBreadcrumb },
    MiPagination: { name: 'MiPagination' as const, component: MiPagination },
    MiStep: { name: 'MiStep' as const, component: MiStep },
    MiTab: { name: 'MiTab' as const, component: MiTab },
} as const;

export {
    MiAvatar,
    MiButton,
    MiAutocomplete,
    MiCheckbox,
    MiCheckboxGroup,
    MiDatePicker,
    MiField,
    MiRadio,
    MiRadioGroup,
    MiSelect,
    MiSwitch,
    MiTextarea,
    MiAlert,
    MiBadge,
    MiDialog,
    MiDrawer,
    MiModal,
    MiNotificationItem,
    MiNotifications,
    MiProgress,
    MiRating,
    MiFrame,
    MiPictureFrame,
    MiFieldAccordionList,
    MiFieldFrame,
    MiInputTextCounter,
    MiOpacityTransition,
    MiOpacityTransitionGroup,
    MiTranslateTransition,
    MiTranslateTransitionGroup,
    MiBottomNav,
    MiBreadcrumb,
    MiPagination,
    MiStep,
    MiTab,
}

declare module 'vue' {
    interface GlobalComponents {
        MiAvatar: typeof MiAvatar;
        MiButton: typeof MiButton;
        MiAutocomplete: typeof MiAutocomplete;
        MiCheckbox: typeof MiCheckbox;
        MiCheckboxGroup: typeof MiCheckboxGroup;
        MiDatePicker: typeof MiDatePicker;
        MiField: typeof MiField;
        MiRadio: typeof MiRadio;
        MiRadioGroup: typeof MiRadioGroup;
        MiSelect: typeof MiSelect;
        MiSwitch: typeof MiSwitch;
        MiTextarea: typeof MiTextarea;
        MiAlert: typeof MiAlert;
        MiBadge: typeof MiBadge;
        MiDialog: typeof MiDialog;
        MiDrawer: typeof MiDrawer;
        MiModal: typeof MiModal;
        MiNotificationItem: typeof MiNotificationItem;
        MiNotifications: typeof MiNotifications;
        MiProgress: typeof MiProgress;
        MiRating: typeof MiRating;
        MiFrame: typeof MiFrame;
        MiPictureFrame: typeof MiPictureFrame;
        MiFieldAccordionList: typeof MiFieldAccordionList;
        MiFieldFrame: typeof MiFieldFrame;
        MiInputTextCounter: typeof MiInputTextCounter;
        MiOpacityTransition: typeof MiOpacityTransition;
        MiOpacityTransitionGroup: typeof MiOpacityTransitionGroup;
        MiTranslateTransition: typeof MiTranslateTransition;
        MiTranslateTransitionGroup: typeof MiTranslateTransitionGroup;
        MiBottomNav: typeof MiBottomNav;
        MiBreadcrumb: typeof MiBreadcrumb;
        MiPagination: typeof MiPagination;
        MiStep: typeof MiStep;
        MiTab: typeof MiTab;
    }
}
