import { ApiCurrencyResponse } from "~/shared";
import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useEffect,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import {
  autoUpdate,
  FloatingFocusManager,
  FloatingPortal,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import VirtualizedList from "rc-virtual-list";
import debounce from "lodash.debounce";

type Props = {
  data: ApiCurrencyResponse[];
  defaultCoin?: ApiCurrencyResponse | null;
  defaultValue?: number;
  onCoinChange: (coin: ApiCurrencyResponse) => void;
  onInputChange?: (value: number) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

export const CurrencyInput = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {
    const {
      data = [],
      onInputChange,
      defaultCoin,
      placeholder = "Введите число",
      className,
      onCoinChange,
      ...rest
    } = props;

    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTicker, setSelectedTicker] = useState<string | null>(
      defaultCoin?.ticker ?? null,
    );
    const [listData, setListData] = useState<ApiCurrencyResponse[]>(data ?? []);

    useEffect(() => {
      setValue(String(props.value ?? ""));
    }, [props.value]);

    const { refs, floatingStyles, context } = useFloating({
      placement: "bottom-start",
      open: isOpen,
      onOpenChange: setIsOpen,
      whileElementsMounted: autoUpdate,
      middleware: [
        size({
          apply({ rects, elements, availableHeight }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${availableHeight}px`,
              width: `${rects.reference.width}px`,
              top: `-${rects.reference.height}px`,
            });
          },
          padding: 10,
        }),
      ],
    });

    const click = useClick(context, { event: "mousedown" });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: "listbox" });

    const { getReferenceProps, getFloatingProps } = useInteractions([
      dismiss,
      role,
      click,
    ]);

    useEffect(() => {
      if (defaultCoin) {
        setSelectedTicker(defaultCoin?.ticker);
        setListData(data);
      }
    }, [defaultCoin, data]);

    useEffect(() => {
      if (isOpen) {
        setListData(data);
      }
    }, [isOpen]);

    const handleCoinSelection = (index: number) => {
      setSelectedTicker(listData[index].ticker);
      onCoinChange?.(listData[index]);
      setIsOpen(false);
    };

    const debouncedUpdate = useCallback(
      debounce((val) => onInputChange?.(val), 600),
      [props],
    );

    const handleDebouncedUpdate = (e: ChangeEvent<HTMLInputElement>) => {
      const formattedValue = e.target.value.replaceAll(" ", "");
      setValue(formattedValue);
      debouncedUpdate(+formattedValue);
    };

    return (
      <>
        <div
          ref={refs.setReference}
          className={twMerge(
            "flex items-center gap-1 rounded-sm border border-grey-200 bg-grey-100 md:gap-3",
            className,
          )}
        >
          <input
            {...rest}
            required
            placeholder={value === "—" ? value : placeholder}
            ref={ref}
            type={"number"}
            value={value}
            className={
              "flex-[0_0_30%] border-none bg-transparent p-0 px-4 py-3 outline-none md:flex-1"
            }
            onChange={handleDebouncedUpdate}
          />
          <span className={"block h-1/3 w-0.5 rounded-sm bg-grey-200 py-3"} />
          <span
            className={
              "flex w-full cursor-pointer items-center justify-center gap-4 py-3 pr-3 md:w-auto"
            }
            {...getReferenceProps()}
            tabIndex={0}
          >
            {!selectedTicker && (
              <span className={"text-neutral-400"}>Выберите валюту</span>
            )}
            {selectedTicker && (
              <>
                <img
                  alt={`Логотип валюты ${selectedTicker}`}
                  src={listData.find((c) => c.ticker === selectedTicker)?.image}
                />
                <span className={"uppercase"}>{selectedTicker}</span>
              </>
            )}
          </span>
        </div>
        {isOpen && (
          <FloatingPortal>
            <FloatingFocusManager context={context} modal={false}>
              <div
                className={"h-fit rounded-lg border border-grey-200 bg-white"}
                {...getFloatingProps()}
                ref={refs.setFloating}
                style={floatingStyles}
              >
                <input
                  placeholder={"Search"}
                  className={
                    "w-full border-b border-b-grey-200 bg-transparent px-4 py-2 outline-none"
                  }
                  onChange={(e) =>
                    setListData(
                      data.filter(
                        (c) =>
                          c.name.includes(e.target.value) ||
                          c.ticker.includes(e.target.value),
                      ),
                    )
                  }
                />
                {listData?.length === 0 && (
                  <span className={"block px-4 py-3"}>Список пуст</span>
                )}
                {listData?.length > 0 && (
                  <ul className={"relative overflow-y-auto"}>
                    <VirtualizedList
                      data={listData.map((_, i) => i)}
                      height={280}
                      itemHeight={48}
                      itemKey={"ticker"}
                    >
                      {(index: number) => (
                        <li
                          key={listData[index].ticker}
                          role="option"
                          aria-selected={
                            listData[index].ticker === selectedTicker
                          }
                          className={twMerge(
                            "flex cursor-pointer items-center px-4 py-3 transition-colors hover:bg-[#EAF1F7]",
                            listData[index].ticker === selectedTicker &&
                              "bg-sky-100 hover:bg-sky-100",
                          )}
                          onClick={() => handleCoinSelection(index)}
                        >
                          <img
                            alt={`Иконка валюты ${listData[index].ticker}`}
                            loading={"lazy"}
                            src={listData[index].image}
                          />
                          <span className={"pl-3 uppercase"}>
                            {listData[index].ticker}
                          </span>
                          <span className={"line-clamp-1 pl-4 text-[#80A2B6]"}>
                            {listData[index].name}
                          </span>
                        </li>
                      )}
                    </VirtualizedList>
                  </ul>
                )}
              </div>
            </FloatingFocusManager>
          </FloatingPortal>
        )}
      </>
    );
  },
);
CurrencyInput.displayName = "CurrencyInput";
