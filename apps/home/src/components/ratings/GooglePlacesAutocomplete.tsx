// apps/home/src/components/ratings/GooglePlacesAutocomplete.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import styles from "@/app/ratings/page.module.css";

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    place_id?: string;
  }) => void;
  inputName?: string;
  inputPlaceholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  inputId?: string;
}

const libraries: ("places")[] = ["places"];

export function GooglePlacesAutocomplete({
  onPlaceSelect,
  inputName = "restaurant_name",
  inputPlaceholder = "輸入餐廳名稱或地址...",
  value: controlledValue,
  onChange,
  inputId,
}: GooglePlacesAutocompleteProps) {
  const [internalValue, setInternalValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  // 使用受控或非受控模式
  const isControlled = controlledValue !== undefined;
  const inputValue = isControlled ? controlledValue : internalValue;
  
  const setInputValue = (newValue: string) => {
    if (isControlled) {
      onChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // 如果没有 API Key，直接返回普通输入框
  if (!apiKey) {
    return (
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        name={inputName}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={inputPlaceholder}
        className={styles.formInput}
        required
      />
    );
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  useEffect(() => {
    if (!isLoaded || !inputRef.current || loadError) {
      return;
    }

    // 初始化 Autocomplete（行動裝置優化）
    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["establishment"], // 限制為商家/機構
      fields: ["name", "formatted_address", "geometry", "place_id"],
      componentRestrictions: undefined, // 允許全球搜尋
    });

    // 行動裝置優化：確保下拉選單可見
    if (inputRef.current) {
      // 禁用瀏覽器的自動完成以避免衝突
      inputRef.current.setAttribute("autocomplete", "off");
      // 確保輸入框在行動裝置上正確顯示
      inputRef.current.setAttribute("inputmode", "text");
    }

    autocompleteRef.current = autocomplete;

    // 監聽選擇事件
    const handlePlaceChanged = () => {
      const place = autocomplete.getPlace();

      if (place.name && place.formatted_address) {
        const location = place.geometry?.location;
        onPlaceSelect({
          name: place.name,
          address: place.formatted_address,
          latitude: location?.lat(),
          longitude: location?.lng(),
          place_id: place.place_id,
        });
        // 更新輸入值（會觸發 onChange）
        setInputValue(place.name);
      }
    };

    autocomplete.addListener("place_changed", handlePlaceChanged);

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, loadError, onPlaceSelect]);

  // 當受控值改變時，同步更新輸入框的值
  useEffect(() => {
    if (isControlled && inputRef.current && inputRef.current.value !== controlledValue) {
      inputRef.current.value = controlledValue || "";
    }
  }, [isControlled, controlledValue]);

  if (loadError) {
    // 檢查是否是授權錯誤
    const errorMessage = String(loadError.message || '').toLowerCase();
    const isRefererError = errorMessage.includes('referer') || errorMessage.includes('not allowed');
    
    // 取得當前域名
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    
    return (
      <div className={styles.errorMessage}>
        {isRefererError ? (
          <div>
            <div style={{ marginBottom: '8px', fontWeight: 600 }}>
              Google Maps API 授權錯誤
            </div>
            <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
              請在 Google Cloud Console 中為此 API Key 添加以下授權域名：
              <br />
              {currentOrigin && (
                <>
                  <code style={{ 
                    display: 'inline-block', 
                    marginTop: '4px', 
                    padding: '4px 8px', 
                    background: 'rgba(0,0,0,0.05)', 
                    borderRadius: '4px',
                    fontFamily: 'monospace'
                  }}>
                    {currentOrigin}/*
                  </code>
                  <br />
                </>
              )}
              <code style={{ 
                display: 'inline-block', 
                marginTop: '4px', 
                padding: '4px 8px', 
                background: 'rgba(0,0,0,0.05)', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                http://localhost:3000/*
              </code>
              <br />
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: 'var(--accent)', 
                  textDecoration: 'underline',
                  marginTop: '8px',
                  display: 'inline-block'
                }}
              >
                前往 Google Cloud Console 設定 →
              </a>
            </div>
          </div>
        ) : (
          <div>
            Google Maps 載入失敗。請檢查 API Key 設定。
            <br />
            <span style={{ fontSize: '12px', opacity: 0.8 }}>
              錯誤：{loadError.message}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        name={inputName}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={inputPlaceholder}
        className={styles.formInput}
        autoComplete="off"
        inputMode="text"
        required
      />
    );
  }

  return (
    <input
      ref={inputRef}
      id={inputId}
      type="text"
      name={inputName}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={inputPlaceholder}
      className={styles.formInput}
      autoComplete="off"
      inputMode="text"
      required
    />
  );
}

