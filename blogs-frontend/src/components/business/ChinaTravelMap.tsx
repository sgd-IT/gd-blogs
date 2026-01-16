"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

type GeoFeature = {
  type: "Feature";
  properties?: { name?: string };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
};

type GeoData = {
  type: "FeatureCollection";
  features: GeoFeature[];
};

type TravelSpot = {
  name: string;
  pos: [number, number];
  photo: string;
  note?: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8124";
const TOUR_IMAGE_BASE = `${BACKEND_URL}/uploads/images/tours`;

const TRAVEL_SPOTS: TravelSpot[] = [
  { name: "重庆", pos: [106.55, 29.56], photo: `${TOUR_IMAGE_BASE}/chongqing.jpg` },
  { name: "泸州", pos: [105.44, 28.87], photo: `${TOUR_IMAGE_BASE}/luzhou.jpg` },
  { name: "宜宾", pos: [104.64, 28.75], photo: `${TOUR_IMAGE_BASE}/yibin.jpg` },
  { name: "合肥", pos: [117.22, 31.82], photo: `${TOUR_IMAGE_BASE}/hefei.jpg` },
  { name: "黄山", pos: [118.33, 29.71], photo: `${TOUR_IMAGE_BASE}/huangshan.jpg` },
  { name: "南京", pos: [118.79, 32.06], photo: `${TOUR_IMAGE_BASE}/nanjing.jpg` },
  { name: "贵州", pos: [106.63, 26.64], photo: `${TOUR_IMAGE_BASE}/guizhou.jpg` },
  { name: "东莞", pos: [113.75, 23.02], photo: `${TOUR_IMAGE_BASE}/dongguan.jpg` },
  { name: "广州", pos: [113.26, 23.12], photo: `${TOUR_IMAGE_BASE}/guangzhou.jpg` },
  { name: "海口", pos: [110.34, 20.01], photo: `${TOUR_IMAGE_BASE}/haikou.jpg` },
  { name: "柳州", pos: [109.41, 24.32], photo: `${TOUR_IMAGE_BASE}/liuzhou.jpg` },
  { name: "罗浮山", pos: [114.06, 23.27], photo: `${TOUR_IMAGE_BASE}/luofushan.jpg` },
];

const MAP_URL = "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json";
const VIEWBOX_WIDTH = 800;
const VIEWBOX_HEIGHT = 640;

function collectCoords(geometry: GeoFeature["geometry"]) {
  const coords: [number, number][] = [];
  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach((ring) => {
      ring.forEach((point) => coords.push([point[0], point[1]]));
    });
  } else {
    geometry.coordinates.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach((point) => coords.push([point[0], point[1]]));
      });
    });
  }
  return coords;
}

function buildPath(
  geometry: GeoFeature["geometry"],
  project: (lon: number, lat: number) => [number, number]
) {
  const segments: string[] = [];
  const handleRing = (ring: number[][]) => {
    ring.forEach((point, index) => {
      const [x, y] = project(point[0], point[1]);
      segments.push(`${index === 0 ? "M" : "L"}${x},${y}`);
    });
    segments.push("Z");
  };

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach(handleRing);
  } else {
    geometry.coordinates.forEach((polygon) => {
      polygon.forEach(handleRing);
    });
  }

  return segments.join(" ");
}

export default function ChinaTravelMap() {
  const [mapData, setMapData] = useState<GeoData | null>(null);
  const [active, setActive] = useState<TravelSpot>(TRAVEL_SPOTS[0]);

  useEffect(() => {
    const fetchMap = async () => {
      const res = await fetch(MAP_URL);
      const data: GeoData = await res.json();
      setMapData(data);
    };
    void fetchMap();
  }, []);

  const { paths, project } = useMemo(() => {
    if (!mapData) {
      return {
        paths: [] as { name: string; d: string }[],
        project: (_lon: number, _lat: number) => [0, 0] as [number, number],
      };
    }

    const allCoords = mapData.features.flatMap((feature) =>
      collectCoords(feature.geometry)
    );
    const lons = allCoords.map((c) => c[0]);
    const lats = allCoords.map((c) => c[1]);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    const projectFn = (lon: number, lat: number): [number, number] => {
      const x = ((lon - minLon) / (maxLon - minLon)) * VIEWBOX_WIDTH;
      const y = ((maxLat - lat) / (maxLat - minLat)) * VIEWBOX_HEIGHT;
      return [x, y];
    };

    const pathList = mapData.features.map((feature) => ({
      name: feature.properties?.name ?? "province",
      d: buildPath(feature.geometry, projectFn),
    }));

    return { paths: pathList, project: projectFn };
  }, [mapData]);

  return (
    <div className="mt-16 rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-black/40">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 text-orange-500" />
            旅行足迹 · 中国
          </div>
          <div className="mt-4 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-black">
            <svg
              viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
              className="h-auto w-full"
              role="img"
              aria-label="China travel map"
            >
              <g fillRule="evenodd">
                {paths.map((p) => (
                  <path
                    key={p.name + p.d.slice(0, 8)}
                    d={p.d}
                    className="fill-gray-50 stroke-gray-200 dark:fill-[#0f0f0f] dark:stroke-gray-800"
                    strokeWidth={1}
                  />
                ))}
              </g>

              {TRAVEL_SPOTS.map((spot) => {
                const [x, y] = project(spot.pos[0], spot.pos[1]);
                const isActive = active.name === spot.name;
                return (
                  <g key={spot.name} onClick={() => setActive(spot)}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 6.5 : 5}
                      className="fill-orange-500"
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={isActive ? 14 : 12}
                      className="fill-orange-400/20"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="w-full lg:w-[300px]">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            点击地图上的城市，查看回忆照片
          </div>
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 12, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="mt-4 rounded-2xl bg-white p-3 shadow-xl dark:bg-[#0f0f0f]"
          >
            <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
              <img
                src={active.photo}
                alt={active.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-3 text-center text-sm font-medium text-gray-700 dark:text-gray-200">
              {active.name}
            </div>
            {active.note ? (
              <div className="mt-1 text-center text-xs text-gray-500 dark:text-gray-400">
                {active.note}
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
