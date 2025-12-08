"use client";

import Image from "next/image";
import { useState } from "react";

// ここで WishItem 型を直接定義する
type WishItem = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl: string;
  targetAmount?: number | null;
  currentAmount?: number | null;
};

// 既存の Props もこんな形になっているはず
type Props = {
  wishItems: WishItem[];
  totalTargetAmount?: number | null;
  totalCurrentAmount: number;
};

// ↓この下のコンポーネント本体はそのままでOK
