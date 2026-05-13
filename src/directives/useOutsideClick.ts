import { type Directive } from 'vue';

type HandlerEntry = {
    handler: (event: Event) => void;
    isActive: boolean;
    ignore: Element[];
};

const handlerMap = new Map<Element, HandlerEntry>();

const onGlobalClick = (event: Event) => {
    handlerMap.forEach((entry) => {
        if (!entry.isActive) {
            return;
        }

        const hasIgnoreElement = entry.ignore.length
            ? entry.ignore.find((ignoreEl) => {
                  if (typeof ignoreEl === 'string') {
                      const nodes = document.querySelectorAll(ignoreEl);
                      return Array.from<Element>(nodes).find((node) =>
                          node.contains(event.target as Node)
                      );
                  } else {
                      return ignoreEl.contains(event.target as Node);
                  }
              })
            : false;

        if (!hasIgnoreElement) {
            entry.handler(event);
        }
    });
};

const vOutsideClick: Directive = {
    mounted: (el, binding) => {
        const entry: HandlerEntry = {
            handler: () => {},
            isActive: true,
            ignore: []
        };
        if (typeof binding.value === 'function') {
            entry.handler = binding.value;
        } else if (typeof binding.value === 'object') {
            Object.assign(entry, binding.value);
        }
        handlerMap.set(el, entry);
        if (handlerMap.size === 1) {
            window.addEventListener('click', onGlobalClick);
        }
    },
    beforeUnmount: (el) => {
        handlerMap.delete(el);
        if (handlerMap.size === 0) {
            window.removeEventListener('click', onGlobalClick);
        }
    },
    updated: (el, binding) => {
        if (typeof binding.value === 'object') {
            const entry = handlerMap.get(el);
            if (entry) {
                Object.assign(entry, binding.value);
            }
        }
    }
};

export default function () {
    return { vOutsideClick };
}
