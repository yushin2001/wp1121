"use client";

import dayjs from "dayjs";

type TimeTextProps = {
  date: dayjs.ConfigType;
  format: string;
};

export default function TimeText({ date, format }: TimeTextProps) {
  return <>{dayjs(date).format(format)}</>;
}
