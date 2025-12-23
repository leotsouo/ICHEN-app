// apps/restaurant-ratings/src/components/ratings/RestaurantForm.tsx
"use client";

import { useState, useTransition, useRef } from "react";
import { addRestaurant } from "@ichen-app/shared-ratings";
import { GooglePlacesAutocomplete } from "./GooglePlacesAutocomplete";
import styles from "@/app/ratings/page.module.css";

interface PlaceData {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  place_id?: string;
}

export function RestaurantForm() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // 當選擇地點時，同步更新手動輸入的狀態
  const handlePlaceSelect = (place: PlaceData) => {
    setSelectedPlace(place);
    setManualName(place.name);
    setManualAddress(place.address);
    setError(null);
    setSuccess(null);
  };

  // 當手動輸入名稱時，清除選擇的地點（如果名稱不匹配）
  const handleNameChange = (value: string) => {
    setManualName(value);
    if (selectedPlace && value !== selectedPlace.name) {
      // 如果手動修改了名稱，清除選擇的地點
      setSelectedPlace(null);
    }
    setError(null);
    setSuccess(null);
  };

  // 當手動輸入地址時，更新狀態
  const handleAddressChange = (value: string) => {
    setManualAddress(value);
    if (selectedPlace && value !== selectedPlace.address) {
      // 如果手動修改了地址，清除選擇的地點
      setSelectedPlace(null);
    }
    setError(null);
    setSuccess(null);
  };

  // 客戶端驗證
  const validateForm = (formData: FormData): string | null => {
    const name = String(formData.get("name") || "").trim();
    const address = String(formData.get("address") || "").trim();

    if (!name || name.length === 0) {
      return "請輸入餐廳名稱";
    }

    if (name.length > 100) {
      return "餐廳名稱過長（最多 100 字）";
    }

    if (address && address.length > 200) {
      return "地址過長（最多 200 字）";
    }

    return null;
  };

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSuccess(null);

    // 客戶端驗證
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    // 如果使用 Google Places，使用選擇的資料
    if (selectedPlace) {
      formData.set("name", selectedPlace.name);
      formData.set("address", selectedPlace.address);
      if (selectedPlace.latitude !== undefined) {
        formData.set("latitude", selectedPlace.latitude.toString());
      }
      if (selectedPlace.longitude !== undefined) {
        formData.set("longitude", selectedPlace.longitude.toString());
      }
      if (selectedPlace.place_id) {
        formData.set("place_id", selectedPlace.place_id);
      }
    } else {
      // 使用手動輸入的資料
      const name = String(formData.get("name") || "").trim();
      const address = String(formData.get("address") || "").trim();
      formData.set("name", name);
      formData.set("address", address || "");
    }

    startTransition(async () => {
      try {
        await addRestaurant(formData);
        
        // 顯示成功訊息
        const restaurantName = String(formData.get("name") || "").trim();
        setSuccess(`餐廳「${restaurantName}」已成功新增！`);
        
        // 重置表單狀態
        setSelectedPlace(null);
        setManualName("");
        setManualAddress("");
        
        // 重置表單元素
        if (formRef.current) {
          formRef.current.reset();
        }
        
        // 清除成功訊息（3秒後）
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "新增餐廳失敗";
        setError(errorMessage);
      }
    });
  };

  return (
    <form
      ref={formRef}
      id="restaurant-form"
      action={handleSubmit}
      className={styles.reviewForm}
    >
      {/* 錯誤訊息 */}
      {error && (
        <div className={styles.bannerWarn} style={{ marginBottom: "12px" }}>
          {error}
        </div>
      )}

      {/* 成功訊息 */}
      {success && (
        <div className={styles.bannerSuccess} style={{ marginBottom: "12px" }}>
          {success}
        </div>
      )}

      {/* 餐廳名稱（使用 Google Places Autocomplete） */}
      <div className={styles.formRow}>
        <label className={styles.formLabel} htmlFor="restaurant-name-input">
          餐廳名稱 *
        </label>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          <GooglePlacesAutocomplete
            onPlaceSelect={handlePlaceSelect}
            inputName="name"
            inputPlaceholder="搜尋餐廳名稱或地址..."
            value={manualName}
            onChange={handleNameChange}
            inputId="restaurant-name-input"
          />
          {selectedPlace && (
            <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>
              ✓ 已選擇：{selectedPlace.name}
              {selectedPlace.address && ` - ${selectedPlace.address}`}
            </div>
          )}
        </div>
      </div>

      {/* 地址（自動填充，但可手動編輯） */}
      <div className={styles.formRow}>
        <label className={styles.formLabel} htmlFor="restaurant-address-input">
          地址
        </label>
        <input
          id="restaurant-address-input"
          type="text"
          name="address"
          value={manualAddress}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="地址（會自動填充，也可手動輸入）"
          className={styles.formInput}
          maxLength={200}
        />
      </div>

      {/* 隱藏欄位：座標和 Place ID */}
      {selectedPlace?.latitude !== undefined && (
        <input type="hidden" name="latitude" value={selectedPlace.latitude} />
      )}
      {selectedPlace?.longitude !== undefined && (
        <input type="hidden" name="longitude" value={selectedPlace.longitude} />
      )}
      {selectedPlace?.place_id && (
        <input type="hidden" name="place_id" value={selectedPlace.place_id} />
      )}

      <div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? "新增中..." : "新增餐廳"}
        </button>
      </div>

      <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
        💡 提示：輸入餐廳名稱時會自動搜尋 Google 地圖上的餐廳資訊，也可以手動輸入
      </div>
    </form>
  );
}

