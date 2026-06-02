import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TeleportRoot from '@/components/inner-parts/TeleportRoot.vue';

describe('TeleportRoot', () => {
    it('マウント前は Teleport が disabled になっている', () => {
        const wrapper = mount(TeleportRoot, {
            slots: { default: '<span class="content">test</span>' }
        });
        const vm = wrapper.vm as unknown as { mounted: boolean };
        expect(vm.mounted).toBe(true);
    });

    it('スロットコンテンツが描画される', () => {
        const wrapper = mount(TeleportRoot, {
            slots: { default: '<span class="content">test</span>' }
        });
        expect(wrapper.find('.content').exists()).toBe(true);
    });

    it('マウント後は body に Teleport されている', async () => {
        const wrapper = mount(TeleportRoot, {
            slots: { default: '<span class="teleported">hello</span>' },
            attachTo: document.body
        });
        expect(document.body.querySelector('.teleported')).not.toBeNull();
        wrapper.unmount();
    });
});
