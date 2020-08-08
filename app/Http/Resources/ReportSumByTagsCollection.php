<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ReportSumByTagsCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray($request)
    {
        $tagsCollection = $this->collection;

        $tagsCollection->each(function ($item) {
            if ($item['tag_id'] === null) {
                $item['tag_id'] = 0;
            }
            if ($item['name'] === null) {
                $item['name'] = 'Без подкатегории';
            }
        });

        return [
            'data' => $tagsCollection->keyBy('tag_id')
        ];
    }
}
